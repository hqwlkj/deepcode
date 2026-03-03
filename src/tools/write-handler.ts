import * as fs from "fs";
import * as path from "path";
import type { ToolExecutionContext, ToolExecutionResult } from "./executor";
import { wasFileRead } from "./state";

export async function handleWriteTool(
  args: Record<string, unknown>,
  context: ToolExecutionContext
): Promise<ToolExecutionResult> {
  const filePath = typeof args.file_path === "string" ? args.file_path : "";
  if (!filePath.trim()) {
    return {
      ok: false,
      name: "write",
      error: "Missing required \"file_path\" string."
    };
  }

  if (!path.isAbsolute(filePath)) {
    return {
      ok: false,
      name: "write",
      error: "file_path must be an absolute path."
    };
  }

  const content = typeof args.content === "string" ? args.content : null;
  if (content === null) {
    return {
      ok: false,
      name: "write",
      error: "Missing required \"content\" string."
    };
  }

  if (fs.existsSync(filePath)) {
    let stat: fs.Stats;
    try {
      stat = fs.statSync(filePath);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        ok: false,
        name: "write",
        error: `Failed to stat file: ${message}`
      };
    }

    if (stat.isDirectory()) {
      return {
        ok: false,
        name: "write",
        error: "file_path points to a directory."
      };
    }

    if (!wasFileRead(context.sessionId, filePath)) {
      return {
        ok: false,
        name: "write",
        error: "Must read existing file before writing."
      };
    }
  }

  const normalizedContent = content.length > 0 && !content.endsWith("\n")
    ? `${content}\n`
    : content;

  try {
    fs.writeFileSync(filePath, normalizedContent, "utf8");
    return {
      ok: true,
      name: "write",
      output: `Wrote ${Buffer.byteLength(normalizedContent, "utf8")} bytes to ${filePath}.`
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      ok: false,
      name: "write",
      error: message
    };
  }
}
