import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import authenticateLinear from "./middlewares/linear";
import ActiveIssues from "./routes/active";
import Changelog from "./routes/changelog";
import IssueContent from "./routes/search/content";
import IssueId from "./routes/search/id";

const router = OpenAPIRouter({
	schema: {
		servers: [
			{ url: "https://gpt-linear.nsimonfr.workers.dev" },
		],
		info: {
			title: "Worker OpenAPI Example",
			version: "1.0",
		},
		security: [
			{ BearerAuth: [] },
		],
	},
	aiPlugin: {
		name_for_human: 'Linear GPT',
		name_for_model: 'linear_gpt',
		description_for_human: "Access linear SDK",
		description_for_model:
			"Plugin for retrieving information from Linear API. Use it whenever a user asks something that might be related to Issues, Projects, Tickets, Milestones etc.",
		contact_email: 'nsimon@pm.me',
		legal_info_url: 'https://linear.app/privacy',
		logo_url: 'https://linear.app/cdn-cgi/imagedelivery/fO02fVwohEs9s9UHFwon6A/1f571644-39f9-4a0d-a4eb-0dd6eea62a00/f=auto,q=95,fit=scale-down,metadata=none',
	},
});

router.registry.registerComponent(
	'securitySchemes',
	'BearerAuth',
	{
		type: 'http',
		scheme: 'bearer',
	},
);

router.all('/linear/*', authenticateLinear);

router.get("/linear/issue/id", IssueId);
router.get("/linear/issue/content", IssueContent);
router.get("/linear/changelog", Changelog);
router.get("/linear/active", ActiveIssues);

// Redirect root request to the /docs page
router.original.get("/", (request: any) =>
	Response.redirect(`${request.url}docs`, 302)
);

// 404 for everything else
router.all("*", () => new Response("Not Found.", { status: 404 }));

export default {
	fetch: router.handle,
};
