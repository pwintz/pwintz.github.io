import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { loadJSON, loadString, removeSaved, saveJSON, saveString } from "../src/common/storage";

// A minimal in-memory localStorage, installed on globalThis for each test.
class MemoryStorage {
  data = new Map<string, string>();
  getItem(key: string) { return this.data.get(key) ?? null; }
  setItem(key: string, value: string) { this.data.set(key, String(value)); }
  removeItem(key: string) { this.data.delete(key); }
}

class BrokenStorage {
  getItem(): string | null { throw new Error("SecurityError"); }
  setItem(): void { throw new Error("QuotaExceededError"); }
  removeItem(): void { throw new Error("SecurityError"); }
}

const install = (storage: unknown) =>
  Object.defineProperty(globalThis, "localStorage", { value: storage, configurable: true, writable: true });

afterEach(() => { delete (globalThis as { localStorage?: unknown }).localStorage; });

test("strings and JSON round-trip", () => {
  install(new MemoryStorage());
  saveString("a", "hello");
  assert.equal(loadString("a"), "hello");
  saveJSON("b", { x: [1, 2], y: null });
  assert.deepEqual(loadJSON("b"), { x: [1, 2], y: null });
  removeSaved("a");
  assert.equal(loadString("a"), null);
});

test("missing keys and invalid JSON load as null", () => {
  install(new MemoryStorage());
  assert.equal(loadJSON("missing"), null);
  saveString("bad", "{not json");
  assert.equal(loadJSON("bad"), null);
});

test("unavailable storage fails quietly", () => {
  install(new BrokenStorage());
  assert.equal(loadString("a"), null);
  assert.equal(loadJSON("a"), null);
  assert.doesNotThrow(() => saveString("a", "x"));
  assert.doesNotThrow(() => saveJSON("a", 1));
  assert.doesNotThrow(() => removeSaved("a"));
});

test("no localStorage at all fails quietly", () => {
  assert.equal(loadString("a"), null);
  assert.doesNotThrow(() => saveString("a", "x"));
});
