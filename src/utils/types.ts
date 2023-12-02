import { z } from "zod";

export const Issue = z.object({
  title: z.string(),
  url: z.string(),
  project: z.string(),
  projectUrl: z.string(),
  assignee: z.string(),
  description: z.string(),
  subIssues: z.array(z.string()),
});

export type IssueType = z.infer<typeof Issue>;
