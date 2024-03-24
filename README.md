# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list



steps

<https://docs.amplify.aws/gen2/start/quickstart/vite-react-app/>

1. `nvs` select 20.11.1 (current LTS version of Node.js) <https://nodejs.org/en>
1. pnpm not supported in deployment so use npm
  1. `curl -fsSL https://get.pnpm.io/install.sh | sh -` <https://npm.io/installation>
1. navigate to the directory where you want to create the project
1. `npm create vite@latest react-amplify-gen2 -- --template react-ts`
1. `cd react-amplify-gen2`
1. `npm install`
1. `npm create amplify@beta`
1. setup credentials <https://docs.amplify.aws/gen2/start/account-setup/>
  1. `npm amplify configure profile --name dev-personal-josh`
  1. enter the access key and secret key and use `us-east-1` as the region
  1. for a real team use <https://docs.amplify.aws/gen2/start/account-setup/#configure-iam-identity-center>
1. `npm amplify sandbox --profile dev-personal-josh`
  1. The given region has not been bootstrapped. Sign in to console as a Root user or Admin to complete the bootstrap process and re-run the amplify sandbox command.
  1. This auto opened the browser to the AWS console and I was already logged in as root user so I just clicked the "Complete bootstrap" button
1. run the local dev server `npm run dev`
1. `npm amplify sandbox --profile dev-personal-josh`
  1. much output ✨ Deployment time: 253.1s
  1. now we are running and amplify is watching for changes
1. followed the tutorial <https://docs.amplify.aws/gen2/start/quickstart/vite-react-app/>
  1. followed the steps and the backend is now configured for user authentication
1. <https://docs.amplify.aws/gen2/start/quickstart/vite-react-app/#build-ui>
1. `npm install @aws-amplify/ui-react`
1. lint the project `npm run lint`
1. build `npm run build`

#### Secrets
// npm amplify sandbox secret set openAiApiKey --profile dev-personal-josh
// npm amplify sandbox secret set openAiAssistantId --profile dev-personal-josh
can call `get` to make sure they are correct
don't seem to be deleted when you `npm amplify sandbox delete --profile dev-personal-josh

### openai-test.js
export OPENAI_API_KEY='your-api-key-here'
node openai-test.js


## Next steps

- [X] setup OpenAI assistant
- [X] call my openAI assistant with secret
- [ ] store assistant conversation as a user attribute
- [X] display assistant conversation
- [ ] try the CI/CD branch deployments
- [ ] look at the telemetry/logs etc. in AWS console (only available once deployed)
