import { LinearClient } from "@linear/sdk";
import { IssueType } from "./types";

const issueQuery = `query Issues($issuesFilter: IssueFilter) {
  issues(filter: $issuesFilter) {
    nodes {
      title
      startedAt
      completedAt
      url
      descriptionData
      team {
        name
      }
      assignee {
        name
      }
      subscribers {
        nodes {
          name
        }
      }
      priorityLabel
      project {
        name
        url
      }
      projectMilestone {
        name
      }
      labels {
        nodes {
          name
        }
      }
      children {
        nodes {
          title
        }
      }
    }
  }
}`;

const getLinearIssues = async (apiKey: string, issuesFilter: any) => {
  const linearClient = new LinearClient({ apiKey });

  const response: any = await linearClient.client.rawRequest(
    issueQuery,
    { issuesFilter }
  );
  const issues = response.data.issues.nodes;

  return issues.map((issue: any) => {
    const title: string = issue.title;
    const url: string = issue.url;
    const description: string = issue.descriptionData;
    const project: string = issue.project?.name;
    const projectUrl: string = issue.project?.url;
    const assignee: string = issue.assignee?.name;
    const subIssues: string[] = issue.children?.nodes.map((c: any) => c.title);

    return {
      title,
      url,
      project,
      projectUrl,
      assignee,
      description,
      subIssues,
    } as IssueType;
  });
};

export default getLinearIssues;