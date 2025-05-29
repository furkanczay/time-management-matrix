import { z } from "zod";
import { Quadrant } from "@/generated/prisma";
export const createTaskSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  quadrant: z.nativeEnum(Quadrant),
  completed: z.boolean().optional(),
});

export const createSubtaskSchema = z.object({
  title: z.string(),
  completed: z.boolean().default(false),
  parentId: z.string(),
});
