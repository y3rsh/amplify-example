import { env } from '$amplify/env/openai';
import OpenAI from 'openai';
import { sleep } from 'openai/core';

export const handler = async (event: any) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    const assistant = await openai.beta.assistants.retrieve(env.OPENAI_ASSISTANT_ID);

    console.log(' Found assistant: ' + assistant.name + ' with Id: ' + assistant.id);

    const thread = await openai.beta.threads.create({
        messages: [
            {
                role: 'user',
                content: '"Hello, my love"',
            },
        ],
    });

    let threadId = thread.id;
    console.log('Created thread with Id: ' + threadId);

    const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
        additional_instructions: 'Please address the user as Josh',
    });

    console.log('Created run with Id: ' + run.id);

    while (true) {
        const result = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        if (result.status == 'completed') {
            const messages = await openai.beta.threads.messages.list(thread.id);
            for (const message of messages.getPaginatedItems()) {
                console.log(message.content);
            }
            return messages.getPaginatedItems().map((message) => message.content);
        } else {
            console.log('Waiting for completion. Current status: ' + result.status);
            await sleep(5000);
        }
    }
};
