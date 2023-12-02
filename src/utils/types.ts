import { z } from "zod";

export const Issue = z.object({
  identifier: z.string(),
  title: z.string(),
  url: z.string(),
  description: z.string(),

  startedAt: z.date().optional(),
  updatedAt: z.date().optional(),
  completedAt: z.date().optional(),

  projectName: z.string(),
  projectUrl: z.string(),

  assigneeName: z.string(),

  stateName: z.string(),

  subIssues: z.array(z.object({
    id: z.string(),
    url: z.string()
  })),
});

export type IssueType = z.infer<typeof Issue>;
