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
