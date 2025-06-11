import { z } from "zod";
export const createTaskSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  quadrant: z.string(),
  completed: z.boolean().optional(),
});

export const createSubtaskSchema = z.object({
  title: z.string(),
  completed: z.boolean().default(false),
  parentId: z.string(),
});
