type ThinkingConfig = {
  type: "enabled";
};

type ThinkingRequestOptions = {
  thinking?: ThinkingConfig;
  extra_body?: {
    thinking: ThinkingConfig;
  };
};

export function buildThinkingRequestOptions(
  thinkingEnabled: boolean,
  baseURL?: string
): ThinkingRequestOptions {
  if (!thinkingEnabled) {
    return {};
  }

  const thinking: ThinkingConfig = { type: "enabled" };
  const normalizedBaseURL = baseURL?.toLowerCase() ?? "";

  if (normalizedBaseURL.includes(".volces.com")) {
    return { thinking };
  }

  return {
    extra_body: { thinking }
  };
}
