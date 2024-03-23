// Import useEffect, useState, useRef from 'react'
import { useState, useEffect, useRef } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

// Assuming listTodos doesn't depend on component state/props
// and can thus be defined outside the component.
async function listTodos() {
  const { data } = await client.models.Todo.list();
  return data;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Schema["Todo"][]>([]);
  // Use a more generic type if specific type is unknown; adjust as needed.
  const subRef = useRef<ReturnType<typeof client.models.Todo.observeQuery> | null>(null);

  useEffect(() => {
    listTodos().then(setTodos);

    const observable = client.models.Todo.observeQuery();
    subRef.current = observable.subscribe({
      next: ({ items }) => setTodos([...items]),
    });

    return () => subRef.current?.unsubscribe();
  }, []);

  return (
    <div>
      <h1>Todos</h1>
      <button onClick={async () => {
        const { errors, data: newTodo } = await client.models.Todo.create({
          content: window.prompt("title") || "", // Added fallback to avoid null
          done: false,
          priority: 'medium',
        });
        console.log(errors, newTodo);
      }}>Create</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
    </div>
  );
}
