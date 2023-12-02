import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
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
	},
});

router.get("/linear/issue/id", IssueId);
router.get("/linear/issue/content", IssueContent);
router.get("/linear/changelog", Changelog);

// Redirect root request to the /docs page
router.original.get("/", (request: any) =>
	Response.redirect(`${request.url}docs`, 302)
);

// 404 for everything else
router.all("*", () => new Response("Not Found.", { status: 404 }));

export default {
	fetch: router.handle,
};
