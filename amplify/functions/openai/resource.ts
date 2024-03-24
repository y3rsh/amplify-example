import { defineFunction, secret } from '@aws-amplify/backend';

export const openai = defineFunction({
    timeoutSeconds: 60,
    environment: {
        OPENAI_API_KEY: secret('openAiApiKey'),
        OPENAI_ASSISTANT_ID: secret('openAiAssistantId')
      }
    });