import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import GetIssue from "./routes/getissue";
// import RecentChangelog from "./routes/recentchangelog";

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

router.get("/linear/issue", GetIssue);
// router.get("/linear/changelog", RecentChangelog);

// Redirect root request to the /docs page
router.original.get("/", (request) =>
	Response.redirect(`${request.url}docs`, 302)
);

// 404 for everything else
router.all("*", () => new Response("Not Found.", { status: 404 }));

export default {
	fetch: router.handle,
};
