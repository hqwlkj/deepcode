import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import type { ToolExecutionContext } from "../tools/executor";
import { handleWebSearchTool } from "../tools/web-search-handler";

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
});

test("WebSearch executes the configured script with the query as one argument", async () => {
  const workspace = createTempWorkspace();
  const scriptPath = path.join(workspace, "web-search.sh");
  fs.writeFileSync(
    scriptPath,
    [
      "#!/bin/sh",
      "printf 'query=%s\\n' \"$1\"",
      "printf 'cwd=%s\\n' \"$PWD\""
    ].join("\n"),
    "utf8"
  );
  fs.chmodSync(scriptPath, 0o755);

  const result = await handleWebSearchTool(
    { query: "latest node release" },
    createContext(workspace, scriptPath)
  );
  const realWorkspace = fs.realpathSync(workspace);

  assert.equal(result.ok, true);
  assert.equal(
    result.output,
    `query=latest node release\ncwd=${realWorkspace}\n`
  );
});

test("WebSearch returns a configuration error when no script is configured", async () => {
  const workspace = createTempWorkspace();
  const result = await handleWebSearchTool(
    { query: "latest node release" },
    createContext(workspace)
  );

  assert.equal(result.ok, false);
  assert.equal(
    result.error,
    "WebSearch is not enabled. Configure ~/.deepcode/settings.json with \"webSearchTool\"."
  );
});

function createContext(projectRoot: string, webSearchTool?: string): ToolExecutionContext {
  return {
    sessionId: "web-search-test",
    projectRoot,
    toolCall: {
      id: "tool-call-id",
      type: "function",
      function: {
        name: "WebSearch",
        arguments: "{}"
      }
    },
    createOpenAIClient: () => ({
      client: null,
      model: "test-model",
      thinkingEnabled: false,
      webSearchTool
    })
  };
}

function createTempWorkspace(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "deepcode-web-search-"));
  tempDirs.push(dir);
  return dir;
}
