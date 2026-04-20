import { test } from "node:test";
import assert from "node:assert/strict";
import { getSystemPrompt, getTools } from "../prompt";

test("getTools omits WebSearch when it is disabled", () => {
  const names = getTools().map((tool) => tool.function.name);
  assert.equal(names.includes("WebSearch"), false);
});

test("getTools includes WebSearch when it is enabled", () => {
  const names = getTools({ webSearchEnabled: true }).map((tool) => tool.function.name);
  assert.equal(names.includes("WebSearch"), true);
});

test("getSystemPrompt excludes WebSearch docs when it is disabled", () => {
  const prompt = getSystemPrompt("/tmp/project");
  assert.equal(prompt.includes("## WebSearch"), false);
});

test("getSystemPrompt includes WebSearch docs when it is enabled", () => {
  const prompt = getSystemPrompt("/tmp/project", { webSearchEnabled: true });
  assert.equal(prompt.includes("## WebSearch"), true);
});
