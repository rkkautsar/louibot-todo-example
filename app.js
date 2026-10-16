const initialTodos = [
  { id: 1, text: "Write the issue", completed: true },
  { id: 2, text: "Review the draft", completed: false },
];

export function createTodoStore(initial = initialTodos) {
  let todos = initial.map((todo) => ({ ...todo }));
  return {
    list() { return todos.map((todo) => ({ ...todo })); },
    summary() {
      const completed = todos.filter((todo) => todo.completed).length;
      return { total: todos.length, active: todos.length - completed, completed };
    },
    add(text) {
      const trimmed = text.trim();
      if (!trimmed) return;
      todos = [...todos, { id: Date.now(), text: trimmed, completed: false }];
    },
    toggle(id) {
      todos = todos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
    },
    remove(id) { todos = todos.filter((todo) => todo.id !== id); },
  };
}

if (typeof document !== "undefined") {
  const store = createTodoStore();
  const list = document.querySelector("#todo-list");
  const form = document.querySelector("#todo-form");
  const input = document.querySelector("#todo-input");
  const empty = document.querySelector("#empty-state");
  const summary = document.querySelector("#todo-summary");
  const filters = document.querySelector("#todo-filters");
  let selectedFilter = "all";

  function render() {
    const allTodos = store.list();
    const visibleTodos = selectedFilter === "active" ? allTodos.filter((todo) => !todo.completed)
      : selectedFilter === "completed" ? allTodos.filter((todo) => todo.completed) : allTodos;
    list.replaceChildren(...visibleTodos.map((todo) => {
      const item = document.createElement("li");
      item.className = `todo-item${todo.completed ? " completed" : ""}`;
      item.innerHTML = `<input type="checkbox" ${todo.completed ? "checked" : ""} aria-label="Complete ${todo.text}"><label>${todo.text}</label><button class="delete" type="button" aria-label="Delete ${todo.text}">delete</button>`;
      item.querySelector("input").addEventListener("change", () => { store.toggle(todo.id); render(); });
      item.querySelector(".delete").addEventListener("click", () => { store.remove(todo.id); render(); });
      return item;
    }));
    empty.hidden = visibleTodos.length > 0;
    const { total, active, completed } = store.summary();
    summary.textContent = `${total} ${total === 1 ? "task" : "tasks"} · ${active} active · ${completed} completed`;
  }

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;
    selectedFilter = button.dataset.filter;
    filters.querySelectorAll("button").forEach((filter) => {
      filter.setAttribute("aria-pressed", String(filter === button));
    });
    render();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    store.add(input.value);
    input.value = "";
    render();
    input.focus();
  });

  render();
}
