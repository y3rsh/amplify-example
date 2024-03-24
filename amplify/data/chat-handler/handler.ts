import { env } from '$amplify/env/chatHandler';
import OpenAI from 'openai';
import { sleep } from 'openai/core';
import type { Schema } from '../resource'

export const handler: Schema["chat"]["functionHandler"] = async (event): Promise<{ reply: string, threadId: string }> => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    const assistant = await openai.beta.assistants.retrieve(env.OPENAI_ASSISTANT_ID);

    console.log(' Found assistant: ' + assistant.name + ' with Id: ' + assistant.id);
    let thread = null;
    if (event.arguments.threadId.toLocaleLowerCase() === 'first'){
        thread = await openai.beta.threads.create({
            messages: [
                {
                    role: 'user',
                    content: `"${event.arguments.input}"`,
                },
            ],
        });
        console.log('Created thread with Id: ' + thread.id);
    }
    else {
        thread = await openai.beta.threads.retrieve(event.arguments.threadId);
        await openai.beta.threads.messages.create(thread.id, {
            role: 'user',
            content: `"${event.arguments.input}"`,
        });
        console.log('Found thread with Id: ' + thread.id);
    }

    const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
    });

    console.log('Created run with Id: ' + run.id);
    let condition: boolean = true;
    while (condition) {
        const timeoutSeconds = 28;
        const sleepMilliseconds = 3000;
        let timeElapsed = 0;
        const result = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        if (timeElapsed >= timeoutSeconds) {
            condition = false;
            console.log('Timeout reached. Current status: ' + result.status);
            return {
                reply: 'Timeout reached. Please try again.',
                threadId: thread.id,
            };
        }
        if (result.status == 'completed') {
            const messages = await openai.beta.threads.messages.list(thread.id);
            const firstMessage = messages.getPaginatedItems()[0].content[0];
            if (firstMessage.type == 'text') {
                console.log(firstMessage.text.value);
                return {
                    reply: firstMessage.text.value,
                    threadId: thread.id,
                };
             }
             else{
                console.log("No messages found.");
                return {
                    reply: "",
                    threadId: thread.id,
                };
            }
        } else {
            console.log('Waiting for completion. Current status: ' + result.status);
            await sleep(sleepMilliseconds);
            timeElapsed += (sleepMilliseconds / 1000);
        }
    }
    // Handle the case where the loop exits without returning.
    console.log("Loop exited without returning.");
    return {
        reply: "",
        threadId: thread.id,
    };
};
