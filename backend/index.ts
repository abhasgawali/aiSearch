import express, { urlencoded } from "express";
import { tavily } from "@tavily/core"
import { Ollama } from "ollama"
import {SYSTEM_PROMPT} from "./prompt.ts"
import { prisma } from "./db.ts";
const app = express();
const client = tavily({ apiKey: process.env.TAVILY_API_KEY});
const ollama = new Ollama({
  host: "https://ollama.com",
  headers: {
    Authorization: "Bearer " + process.env.AI_GATEWAY_API_KEY,
  },
});



app.use(express.json());
app.post( "/signup" , async ( req , res )=>{
} )
app.post( "/signin" , async ( req , res )=>{
} )
app.get( "/conversations" , async ( req , res )=>{
    //list of all past conversations from db
} )
app.get( "/conversation/:conversationId" , async ( req , res) => {
    //get a specific conversation from db 
})
app.post( "/ask" , async ( req , res )=>{
    //get query from the user;
    const userQuery = req.body.query;
    /*  EXAMPLE RESPONSE FROM TAVILY
        {
  "query": "ai learning resources for a dev",
  "follow_up_questions": null,
  "answer": "For developers looking...",
  "images": [],
  "results": [
    {
      "url": "https://dev.to/dev_tips/",
      "title": "",
      "content": "### #7: DataCamp: ",
      "score": 0.69672287,
      "raw_content": null
    } ],

}
    */
    //check if user has enough tokens/credits to do the query;

    //check if we have search indexed already for similar query

    //web search to gather sources + //do some context engineering on the prompt + web search responses
    const webSearchResponse = await client.search( userQuery , {
    searchDepth: "basic"
    })
    const webSearchResult = webSearchResponse.results;
    

    //hit the LLM
    const response = await ollama.chat({
    model: "minimax-m2.5:cloud",
    messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `USER_QUERY: ${userQuery}\nSEARCH_REULTS:\n${webSearchResult}` },
                ],
                stream: true,
    });

    for await (const part of response) {
    res.write(part.message.content);
    }
    res.write("\n------SOURCES------\n")
    //stream back the response  + follow up questions
    res.write(JSON.stringify(webSearchResult.map(result=>(
    {
        title : result.title ,
        url   : result.url
    }
    ))))
    //close the event stream
    res.end()
} )

app.post( "/ask/follow_up" , async ( req , res )=>{
    // Step 1 - get existing chat from the db
    // Step 1.5- TODO : Do context engineering here [why? - the whole history of a chat might be too much of tokens to send and exhaust]
    // Step 2 - forward the full history to the LLM
    // Step 3 - stream response to the client 
})





app.listen(3000);