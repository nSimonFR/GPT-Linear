# GPT Linear

An API to power an OpenAI GPT to use in conjonction with Linear.

Basically, a [worker-openapi](https://github.com/cloudflare/itty-router-openapi) wrapper around [linear sdk](https://developers.linear.app/docs/sdk/getting-started) hosted on [cloudflare workers](https://developers.cloudflare.com/workers/).

## Setup

- Update [index](./index.js) with your wrangler url and remove specifics implementation details you don't need
- Patch [rollup-plugin-node-polyfills](node_modules/rollup-plugin-node-polyfills/polyfills/http-lib/capability.js)
- Run `npm run deploy`
- Navigate to your wrangler /openapi.json and copy the content
- Generate Linear API Key
- [Setup your custom GPT](https://chat.openai.com/gpts/editor/) with [INSTRUCTIONS](./INSTRUCTIONS.md) and your url as action
