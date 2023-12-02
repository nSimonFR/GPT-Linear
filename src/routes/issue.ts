import { OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { z } from "zod";
import getLinearIssues from "../utils/linear";
import { Issue } from "../utils/types";

class GetIssue extends OpenAPIRoute {
  static schema = {
    tags: ["Issues"],
    summary: "Get Issue",
    parameters: {
      id: Query(z.string()),
    },
    responses: {
      "200": {
        description: "Issue",
        schema: {
          issue: Issue,
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
    const { id } = data.query;

    const [team, number] = id.split("-");
    const issuesFilter = {
      and: [
        { team: { key: { eq: team } } },
        { number: { eq: Number(number) } },
      ],
    };

    const issues = await getLinearIssues(env.LINEAR_KEY, issuesFilter);
    const issue = issues[0];

    console.log('[ISSUE] Issue:', id);

    return { issue };
  }
}

export default GetIssue;