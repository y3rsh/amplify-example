import { type ClientSchema, a, defineData, defineFunction, secret } from '@aws-amplify/backend';


// 2. define a function
const chatHandler = defineFunction({
  name: 'chatHandler',
  entry: './chat-handler/handler.ts',
  timeoutSeconds: 30,
  environment: {
    OPENAI_API_KEY: secret('openAiApiKey'),
    OPENAI_ASSISTANT_ID: secret('openAiAssistantId'),
  },
})

const schema = a.schema({
  // 1. Define your return type as a custom type
  ChatResponse: a.customType({
    reply: a.string(),
  }),

  // 2. Define your query with the return type and, optionally, arguments
  chat: a
    .query()
    // arguments that this query accepts
    .arguments({
      input: a.string(),
    })
    // return type of the query
    .returns(a.ref('ChatResponse'))
    // only allow signed-in users to call this API
    .authorization([a.allow.private()])
    // the function that will be called when this query is invoked
    .handler(a.handler.function(chatHandler)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});
