import { OpenAPIRoute } from "@cloudflare/itty-router-openapi";
import { getLinearIssues } from "../utils/linear";
import { Issue } from "../utils/types";

class ActiveIssues extends OpenAPIRoute {
  static schema = {
    tags: ["Issue"],
    summary: "Get recently updated issues (Excluding non-EPIC)",
    parameters: {},
    responses: {
      "200": {
        description: "Issue",
        schema: {
          issues: [Issue],
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
    const issuesFilter = {
      startedAt: {
        "null": false
      },
      completedAt: {
        "null": true
      },
      labels: {
        name: {
          eq: "EPIC"
        }
      },
      team: {
        key: {
          nin: ["DISCO"]
        }
      }
    };

    const issues = await getLinearIssues(env.LINEAR_KEY, issuesFilter);
    console.log('[CHANGELOG] Issues:', issues.length);

    return { issues };
  }
}

export default ActiveIssues;