import { OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { DateTime } from "luxon";
import { z } from "zod";
import { getLinearIssues } from "../utils/linear";
import { Issue } from "../utils/types";

const MINUS_DAYS = 7;

class RecentChangelog extends OpenAPIRoute {
  static schema = {
    tags: ["Issue"],
    summary: "Get completed issues (Default = 7 days - excludes non-EPICs)",
    parameters: {
      dateFrom: Query(z.string().optional()),
      dateTo: Query(z.string().optional()),
    },
    responses: {
      "200": {
        description: "Issue",
        schema: {
          dateFrom: z.date(),
          dateTo: z.date(),
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
    const { query } = data;

    const dateFrom = query.dateFrom || DateTime.now().minus({ days: MINUS_DAYS }).toISODate();
    const dateTo = query.dateTo || DateTime.now().toISODate();

    const issuesFilter = {
      completedAt: {
        "gte": dateFrom
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

    const issues = await getLinearIssues(env.linearClient, issuesFilter);
    console.log('[CHANGELOG] Issues:', issues.length);

    return { dateFrom, dateTo, issues };
  }
}

export default RecentChangelog;