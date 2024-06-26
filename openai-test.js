#!/usr/bin/env -S npm run tsn -T

import OpenAI from 'openai';
import { sleep } from 'openai/core';

/**
 * Example of polling for a complete response from an assistant
 */

const openai = new OpenAI();

async function main() {
  const assistant = await openai.beta.assistants.create({
    model: 'gpt-4-1106-preview',
    name: 'Math Tutor',
    instructions: 'You are a personal math tutor. Write and run code to answer math questions.',
    // tools = [],
  });

  let assistantId = assistant.id;
  console.log('Created Assistant with Id: ' + assistantId);

  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: 'user',
        content: '"I need to solve the equation `3x + 11 = 14`. Can you help me?"',
      },
    ],
  });

  let threadId = thread.id;
  console.log('Created thread with Id: ' + threadId);

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistantId,
    additional_instructions: 'Please address the user as Josh. The user has a premium account.',
  });

  console.log('Created run with Id: ' + run.id);

  while (true) {
    const result = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    if (result.status == 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id);
      for (const message of messages.getPaginatedItems()) {
        console.log(message.content[0].text);
      }
      break;
    } else {
      console.log('Waiting for completion. Current status: ' + result.status);
      await sleep(5000);
    }
  }
}

main();
