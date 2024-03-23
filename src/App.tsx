import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import TodoList from "./components/TodoList";
import './App.css';
import amplifyconfig from '../amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
import type { WithAuthenticatorProps } from '@aws-amplify/ui-react';
import Hello from "./components/Hello";
Amplify.configure(amplifyconfig);

function App({ signOut, user }: WithAuthenticatorProps) {
  return (
    <>
      <h1>Welcome, this is Amplify 👋</h1>
      <Hello user={user} />
      <button onClick={signOut}>Sign out</button>
      <TodoList />
    </>
  );
}

// Use a named export if you need to export more components or utilities from this file
// This helps with the fast refresh's ability to track and update your components efficiently
export { App };

// Use the HOC withAuthenticator and then export
const AppWithAuth = withAuthenticator(App);
export default AppWithAuth;
