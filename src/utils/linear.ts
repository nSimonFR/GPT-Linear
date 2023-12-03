import { Issue, LinearClient, Project, Team, User, WorkflowState } from "@linear/sdk";
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

  const team = issue.team as unknown as Team;
  const teamName = team?.name;

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
    teamName,
    stateName,

    subIssues,
  };
}

export const getLinearIssues = async (linearClient: LinearClient, issuesFilter: any) => {
  const issueQuery = `query Issues($issuesFilter: IssueFilter, $orderBy: PaginationOrderBy) {
    issues(filter: $issuesFilter, orderBy: $orderBy) {
      nodes {
        ${issueNode}
      }
    }
  }`;

  const response: any = await linearClient.client.rawRequest(
    issueQuery,
    { issuesFilter, orderBy: "updatedAt" }
  );
  const issues = response.data.issues.nodes;

  return issues.map(transformIssue);
};


export const searchLinearIssues = async (linearClient: LinearClient, term: string) => {
  const searchIssuesQuery = `query SearchIssues($term: String!, $orderBy: PaginationOrderBy) {
    searchIssues(term: $term, orderBy: $orderBy) {
      nodes {
        ${issueNode}
      }
    }
  }`;

  const response: any = await linearClient.client.rawRequest(
    searchIssuesQuery,
    { term, orderBy: "updatedAt" }
  );
  const issues = response.data.searchIssues.nodes;

  return issues.map(transformIssue);
};