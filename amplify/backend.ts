import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { openai } from './functions/openai/resource';

defineBackend({
  auth,
  data,
  openai,
});
