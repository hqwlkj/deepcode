const readFilesBySession = new Map<string, Set<string>>();
const snippetsBySession = new Map<string, Map<string, FileSnippet>>();
const snippetCountersBySession = new Map<string, number>();

export type FileSnippet = {
  id: string;
  filePath: string;
  startLine: number;
  endLine: number;
  preview: string;
};

export function markFileRead(sessionId: string, filePath: string): void {
  if (!sessionId || !filePath) {
    return;
  }
  let set = readFilesBySession.get(sessionId);
  if (!set) {
    set = new Set<string>();
    readFilesBySession.set(sessionId, set);
  }
  set.add(filePath);
}

export function wasFileRead(sessionId: string, filePath: string): boolean {
  if (!sessionId || !filePath) {
    return false;
  }
  return readFilesBySession.get(sessionId)?.has(filePath) ?? false;
}

export function createSnippet(
  sessionId: string,
  filePath: string,
  startLine: number,
  endLine: number,
  preview: string
): FileSnippet | null {
  if (!sessionId || !filePath || startLine < 1 || endLine < startLine) {
    return null;
  }

  const nextCounter = (snippetCountersBySession.get(sessionId) ?? 0) + 1;
  snippetCountersBySession.set(sessionId, nextCounter);

  const snippet: FileSnippet = {
    id: `snippet_${nextCounter}`,
    filePath,
    startLine,
    endLine,
    preview
  };

  let snippets = snippetsBySession.get(sessionId);
  if (!snippets) {
    snippets = new Map<string, FileSnippet>();
    snippetsBySession.set(sessionId, snippets);
  }
  snippets.set(snippet.id, snippet);
  return snippet;
}

export function getSnippet(sessionId: string, snippetId: string): FileSnippet | null {
  if (!sessionId || !snippetId) {
    return null;
  }
  return snippetsBySession.get(sessionId)?.get(snippetId) ?? null;
}
