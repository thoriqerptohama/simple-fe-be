const express = require("express");
const app = express();
const port = 9000;

// CORS middleware - Move this to the top, before routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // More permissive for development
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Parse JSON bodies
app.use(express.json());

// Define a sample todo list data
let todos = [
  { id: 1, title: "Buy groceries", completed: false },
  { id: 2, title: "Finish homework", completed: true },
  { id: 3, title: "Call mom", completed: false },
  { id: 4, title: "Clean the house", completed: false },
];

// Get all todos
app.get("/todos", (req, res) => {
  res.json(todos);
});

// Create a new todo
app.post("/todos", (req, res) => {
  const { title, completed } = req.body;
  const newTodo = { id: Date.now(), title, completed };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Update a todo
app.patch("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const todo = todos.find((t) => t.id === parseInt(id));
  if (!todo) return res.status(404).json({ error: "Todo not found" });
  if (title) todo.title = title;
  if (typeof completed === "boolean") todo.completed = completed;
  res.json(todo);
});

// Delete a todo
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const index = todos.findIndex((t) => t.id === parseInt(id));
  if (index === -1) return res.status(404).json({ error: "Todo not found" });
  const deletedTodo = todos.splice(index, 1)[0];
  res.json(deletedTodo);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
