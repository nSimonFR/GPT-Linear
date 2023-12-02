import { Issue, LinearClient, Project, User, WorkflowState } from "@linear/sdk";
import { IssueType } from "./types";

const issueNode = `
  title
  identifier
  startedAt
  updatedAt
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
`;

const transformIssue = (issue: Issue): IssueType => {
  const identifier = issue.identifier;
  const title = issue.title;
  const url = issue.url;
  const description = issue.description!;
  const startedAt = issue.startedAt;
  const updatedAt = issue.updatedAt;
  const completedAt = issue.completedAt;

  const project = issue.project as unknown as Project;
  const projectName = project?.name;
  const projectUrl = project?.url;

  const assignee = issue.assignee as unknown as User;
  const assigneeName = assignee?.name;

  const state = issue.state as unknown as WorkflowState;
  const stateName = state?.name;

  const childrens = (issue.children as any)?.nodes as Issue[];
  const subIssues = childrens.map((c: Issue) => ({ id: c.identifier, url: c.url }));

  return {
    title,
    identifier,
    url,
    description,

    startedAt,
    updatedAt,
    completedAt,

    projectName,
    projectUrl,

    assigneeName,

    stateName,

    subIssues,
  };
}

export const getLinearIssues = async (apiKey: string, issuesFilter: any) => {
  const linearClient = new LinearClient({ apiKey });

  const issueQuery = `query Issues($issuesFilter: IssueFilter) {
    issues(filter: $issuesFilter) {
      nodes {
        ${issueNode}
      }
    }
  }`;

  const response: any = await linearClient.client.rawRequest(
    issueQuery,
    { issuesFilter }
  );
  const issues = response.data.issues.nodes;

  return issues.map(transformIssue);
};


export const searchLinearIssues = async (apiKey: string, term: string) => {
  const linearClient = new LinearClient({ apiKey });

  const searchIssuesQuery = `query SearchIssues($term: String!) {
    searchIssues(term: $term) {
      nodes {
        ${issueNode}
      }
    }
  }`;

  const response: any = await linearClient.client.rawRequest(
    searchIssuesQuery,
    { term }
  );
  const issues = response.data.searchIssues.nodes;

  return issues.map(transformIssue);
};