import test from "node:test";
import assert from "node:assert/strict";
import { createTodoStore } from "../app.js";

test("adds, toggles, and removes todo items", () => {
  const store = createTodoStore([]);
  store.add("  Ship the draft  ");
  assert.deepEqual(store.list().map(({ text, completed }) => ({ text, completed })), [{ text: "Ship the draft", completed: false }]);
  const [todo] = store.list();
  store.toggle(todo.id);
  assert.equal(store.list()[0].completed, true);
  store.remove(todo.id);
  assert.deepEqual(store.list(), []);
});

test("ignores blank todo text", () => {
  const store = createTodoStore([]);
  store.add("   ");
  assert.deepEqual(store.list(), []);
});

test("filters todos by completion state and reflects toggles", () => {
  const todos = [
    { id: 1, text: "Finished", completed: true },
    { id: 2, text: "Unfinished", completed: false },
  ];
  const store = createTodoStore(todos);
  const matching = (filter) => store.list().filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  assert.deepEqual(matching("all").map(({ id }) => id), [1, 2]);
  assert.deepEqual(matching("active").map(({ id }) => id), [2]);
  assert.deepEqual(matching("completed").map(({ id }) => id), [1]);

  // Empty filtered views are distinct from the default empty-list state.
  store.toggle(2);
  assert.deepEqual(matching("active"), []);
  assert.deepEqual(matching("completed").map(({ id }) => id), [1, 2]);

  store.toggle(2);
  assert.deepEqual(matching("active").map(({ id }) => id), [2]);
  assert.deepEqual(matching("completed").map(({ id }) => id), [1]);

  store.toggle(1);
  assert.deepEqual(matching("completed"), []);
  assert.deepEqual(matching("active").map(({ id }) => id), [1, 2]);
});
