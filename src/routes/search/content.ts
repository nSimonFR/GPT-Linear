import { OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { z } from "zod";
import { searchLinearIssues } from "../../utils/linear";
import { Issue } from "../../utils/types";

class IssueContent extends OpenAPIRoute {
  static schema = {
    tags: ["Issue", "Search"],
    summary: "Get Issue by content",
    parameters: {
      content: Query(z.string()),
    },
    responses: {
      "200": {
        description: "Issues",
        schema: {
          content: z.string(),
          issue: [Issue],
        },
      },
    },
  };

  async handle(
    request: Request,
    env: any,
    context: any,
    data: Record<string, any>
  ) {
    const { content } = data.query;

    const issues = await searchLinearIssues(env.LINEAR_KEY, content);

    console.log('[ISSUE SEARCH] Issue:', issues.length);

    return { content, issues };
  }
}

export default IssueContent;