import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import TodoList from "./components/TodoList";
import './App.css';


// Define your component as a named function
function App() {
  return (
    <>
      <h1>Hello, Amplify 👋</h1>
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
