import express, { urlencoded } from "express";
import { z } from "zod";
import { tavily } from "@tavily/core"
import { Ollama } from "ollama"
import {SYSTEM_PROMPT} from "./prompt.ts"
import { prisma } from "./db.ts";
import { authMiddleware } from "./middlewares/authMiddleware.ts";
import cors from "cors"
import { PaginationSchema, AskSchema, FollowUpSchema, UpdateConversationSchema } from "./validation.ts"
import { Result } from "pg";

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const app = express();

const client = tavily({ apiKey: process.env.TAVILY_API_KEY});
const ollama = new Ollama({
  host: "https://ollama.com",
  headers: {
    Authorization: "Bearer " + process.env.AI_GATEWAY_API_KEY,
  },
});


app.use(cors())
app.use(express.json());

//signup and signin is managed by supabase auth


app.get( "/conversations" , authMiddleware , async ( req , res )=>{
    try {
        const { success, data, error } = PaginationSchema.safeParse(req.query);
        if (!success) {
            return res.status(400).send({ error: error.issues });
        }

        const userId = res.locals.user.id;
        const conversations = await prisma.conversation.findMany({
            where : { userId : userId},
            take: data.limit,
            skip: data.offset,
        });
        res.send({
            conversations
        });
    } catch (e) {
        res.status(500).send({ error: "Internal server error" });
    }
} )
app.get( "/conversation/:conversationId" , authMiddleware , async ( req , res) => {
    try {
        const { conversationId } = req.params;
        const validation = z.string().uuid().safeParse(conversationId);
        if (!validation.success) {
            return res.status(400).send({ error: "Invalid conversation ID" });
        }

        const userId = res.locals.user.id;
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!conversation) {
            return res.status(404).send({ error: "Conversation not found" });
        }

        if (conversation.userId !== userId) {
            return res.status(403).send({ error: "Unauthorized access to conversation" });
        }

        res.send(conversation);
    } catch (e) {
        res.status(500).send({ error: "Internal server error" });
    }
})
app.post( "/ask" , authMiddleware , async ( req , res )=>{
    try {
        const { success, data, error } = AskSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).send({ error: error.issues });
        }

        const userQuery = data.query;
        const userId = res.locals.user.id;

        const webSearchResponse = await client.search( userQuery , {
            searchDepth: "basic"
        });
        const webSearchResult = webSearchResponse.results;

        const response = await ollama.chat({
            model: "minimax-m2.5:cloud",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `USER_QUERY: ${userQuery}\nSEARCH_RESULTS:\n${JSON.stringify(webSearchResult)}` },
            ],
            stream: true,
        });

        let fullAiResponse = "";
        for await (const part of response) {
            const content = part.message.content;
            fullAiResponse += content;
            res.write(content);
        }

        res.write("\n------SOURCES------\n");
        res.write(JSON.stringify(webSearchResult.map(result=>(
            {
                title : result.title ,
                url   : result.url
            }
        ))));
            
        const newConversation = await prisma.conversation.create({
            data: {
                userId,
                title: userQuery,
                slug: slugify(userQuery),
                sources : webSearchResult.map(result=>(result.url)),
                messages: {
                    create: [
                        { role: 'User', content: userQuery },
                        { role: 'Assistant', content: fullAiResponse }
                    ]
                }
            }
        });

        res.write(`\n------ID------\n${newConversation.id}`);
        res.end();
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: "Internal server error" });
    }
} )

app.post( "/ask/follow_up" , authMiddleware , async ( req , res )=>{
    try {
        const { success, data, error } = FollowUpSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).send({ error: error.issues });
        }

        const { conversationId, query: userQuery } = data;
        const userId = res.locals.user.id;

        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { messages: { orderBy: { createdAt: 'asc' } } }
        });

        if (!conversation) {
            return res.status(404).send({ error: "Conversation not found" });
        }

        if (conversation.userId !== userId) {
            return res.status(403).send({ error: "Unauthorized access to conversation" });
        }

        const history = conversation.messages.map(m => ({
            role: m.role === 'User' ? 'user' : 'assistant',
            content: m.content
        }));

        const response = await ollama.chat({
            model: "minimax-m2.5:cloud",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...history,
                { role: "user", content: userQuery },
            ],
            stream: true,
        });

        let fullAiResponse = "";
        for await (const part of response) {
            const content = part.message.content;
            fullAiResponse += content;
            res.write(content);
        }

        await prisma.message.createMany({
            data: [
                { role: 'User', content: userQuery, conversationId },
                { role: 'Assistant', content: fullAiResponse, conversationId }
            ]
        });

        res.end();
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: "Internal server error" });
    }
} )


app.delete( "/conversation/:conversationId" , authMiddleware , async ( req , res )=>{
    try {
        const { conversationId } = req.params;
        const validation = z.string().uuid().safeParse(conversationId);
        if (!validation.success) {
            return res.status(400).send({ error: "Invalid conversation ID" });
        }

        const userId = res.locals.user.id;
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId }
        });

        if (!conversation) {
            return res.status(404).send({ error: "Conversation not found" });
        }

        if (conversation.userId !== userId) {
            return res.status(403).send({ error: "Unauthorized access to conversation" });
        }

        await prisma.message.deleteMany({
            where: { conversationId }
        });
        await prisma.conversation.delete({
            where: { id: conversationId }
        });

        res.send({ success: true, message: "Conversation deleted successfully" });
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: "Internal server error" });
    }
} )

app.patch( "/conversation/:conversationId" , authMiddleware , async ( req , res )=>{
    try {
        const { conversationId } = req.params;
        const validation = z.string().uuid().safeParse(conversationId);
        if (!validation.success) {
            return res.status(400).send({ error: "Invalid conversation ID" });
        }

        const { success, data, error } = UpdateConversationSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).send({ error: error.issues });
        }

        const userId = res.locals.user.id;
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId }
        });

        if (!conversation) {
            return res.status(404).send({ error: "Conversation not found" });
        }

        if (conversation.userId !== userId) {
            return res.status(403).send({ error: "Unauthorized access to conversation" });
        }

        const updatedConversation = await prisma.conversation.update({
            where: { id: conversationId },
            data: {
                title: data.title,
                slug: slugify(data.title)
            }
        });

        res.send(updatedConversation);
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: "Internal server error" });
    }
} )

app.listen(3000);
