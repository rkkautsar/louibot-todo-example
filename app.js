const initialTodos = [
  { id: 1, text: "Write the issue", completed: true },
  { id: 2, text: "Review the draft", completed: false },
];

export function createTodoStore(initial = initialTodos) {
  let todos = initial.map((todo) => ({ ...todo }));
  return {
    list() { return todos.map((todo) => ({ ...todo })); },
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
  const filters = document.querySelectorAll('[name="todo-filter"]');
  let currentFilter = "all";

  function render() {
    const todos = store.list().filter((todo) => {
      if (currentFilter === "active") return !todo.completed;
      if (currentFilter === "completed") return todo.completed;
      return true;
    });
    list.replaceChildren(...todos.map((todo) => {
      const item = document.createElement("li");
      item.className = `todo-item${todo.completed ? " completed" : ""}`;
      item.innerHTML = `<input type="checkbox" ${todo.completed ? "checked" : ""} aria-label="Complete ${todo.text}"><label>${todo.text}</label><button class="delete" type="button" aria-label="Delete ${todo.text}">delete</button>`;
      item.querySelector("input").addEventListener("change", () => { store.toggle(todo.id); render(); });
      item.querySelector(".delete").addEventListener("click", () => { store.remove(todo.id); render(); });
      return item;
    }));
    empty.hidden = todos.length > 0;
    if (todos.length === 0) {
      empty.textContent = currentFilter === "active"
        ? "No active tasks yet."
        : currentFilter === "completed"
          ? "No completed tasks yet."
          : "Nothing here yet. Add one small thing.";
    }
  }

  filters.forEach((filter) => filter.addEventListener("change", () => {
    currentFilter = filter.value;
    render();
  }));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    store.add(input.value);
    input.value = "";
    render();
    input.focus();
  });

  render();
}
