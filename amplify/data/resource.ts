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
    reply: a.string().required(),
    threadId: a.string().required()
  }),

  UserThread: a.model({
    email: a.email().required(),
    threadId: a.string().required(),
  }).identifier(['email']).authorization([a.allow.private()]),

  // 2. Define your query with the return type and, optionally, arguments
  chat: a
    .query()
    // arguments that this query accepts
    .arguments({
      input: a.string().required(),
      threadId: a.string().required(),
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
