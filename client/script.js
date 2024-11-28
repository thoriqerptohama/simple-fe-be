const todoInput = document.getElementById("todo-input");
const addTodoButton = document.getElementById("add-todo");
const todoList = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");

// Fetch todos from the server

async function fetchTodos() {
  const response = await fetch("http://localhost:9000/todos");
  const todos = await response.json();
  renderTodos(todos);
}
console.log("fetchTodos", fetchTodos);
// Render todos
function renderTodos(todos) {
  todoList.innerHTML = "";
  if (todos.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
    todos.forEach((todo) => createTodoElement(todo));
  }
}

// Create a todo DOM element
function createTodoElement(todo) {
  const todoItem = document.createElement("div");
  todoItem.className = `todo-item ${todo.completed ? "completed" : ""}`;
  todoItem.innerHTML = `
    <span>${todo.title}</span>
    <div>
      <button onclick="toggleTodo('${todo.id}', ${todo.completed})">
        ${todo.completed ? "🔁" : "✔️"}
      </button>
      <button onclick="deleteTodo('${todo.id}')">❌</button>
    </div>
  `;
  todoList.appendChild(todoItem);
}

// Add a new todo
addTodoButton.addEventListener("click", async () => {
  const title = todoInput.value.trim();
  if (!title) return;

  await fetch("http://localhost:9000/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, completed: false }),
  });

  todoInput.value = "";
  fetchTodos();
});

// Toggle a todo's completed state
async function toggleTodo(id, completed) {
  await fetch(`http://localhost:9000/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !completed }),
  });

  fetchTodos();
}

// Delete a todo
async function deleteTodo(id) {
  await fetch(`http://localhost:9000/todos/${id}`, { method: "DELETE" });
  fetchTodos();
}

// Initial fetch
fetchTodos();
