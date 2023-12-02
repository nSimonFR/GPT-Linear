import { Issue, LinearClient, Project, User, WorkflowState } from "@linear/sdk";
import { IssueType } from "./types";

const issueQuery = `query Issues($issuesFilter: IssueFilter) {
  issues(filter: $issuesFilter) {
    nodes {
      title
      identifier
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
      state {
        name
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
          identifier
          url
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

  return issues.map((issue: Issue) => {
    const identifier = issue.identifier;
    const title = issue.title;
    const url = issue.url;
    const description = issue.description!;

    const project = issue.project as unknown as Project;
    const projectName = project.name;
    const projectUrl = project.url;

    const assignee = issue.assignee as unknown as User;
    const assigneeName = assignee.name;

    const state = issue.state as unknown as WorkflowState;
    const stateName = state.name;

    const childrens = (issue.children as any)?.nodes as Issue[];
    const subIssues = childrens.map((c: Issue) => ({ id: c.identifier, url: c.url }));

    return {
      title,
      identifier,
      url,
      description,
      projectName,
      projectUrl,
      assigneeName,
      stateName,
      subIssues,
    } as IssueType;
  });
};

export default getLinearIssues;