import { z } from "zod";

export const AskSchema = z.object({
  query: z.string().min(1, "Query is required"),
});

export const FollowUpSchema = z.object({
  conversationId: z.string().uuid("Invalid conversation ID"),
  query: z.string().min(1, "Query is required"),
});

export const PaginationSchema = z.object({
  limit: z.coerce.number().int().positive().default(20),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export const UpdateConversationSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
});

export type AskRequest = z.infer<typeof AskSchema>;
export type FollowUpRequest = z.infer<typeof FollowUpSchema>;
export type PaginationRequest = z.infer<typeof PaginationSchema>;
export type UpdateConversationRequest = z.infer<typeof UpdateConversationSchema>;
