export type DeepcodingEnv = {
  MODEL?: string;
  BASE_URL?: string;
  API_KEY?: string;
  THINKING?: string;
};

export type DeepcodingSettings = {
  env?: DeepcodingEnv;
  thinkingEnabled?: boolean;
  notify?: string;
  webSearchTool?: string;
};

export type ResolvedDeepcodingSettings = {
  apiKey?: string;
  baseURL: string;
  model: string;
  thinkingEnabled: boolean;
  notify?: string;
  webSearchTool?: string;
};

export function resolveSettings(
  settings: DeepcodingSettings | null | undefined,
  defaults: { model: string; baseURL: string }
): ResolvedDeepcodingSettings {
  const env = settings?.env ?? {};
  const notify = typeof settings?.notify === "string" ? settings.notify.trim() : "";
  const webSearchTool =
    typeof settings?.webSearchTool === "string" ? settings.webSearchTool.trim() : "";

  return {
    apiKey: env.API_KEY?.trim(),
    baseURL: env.BASE_URL?.trim() || defaults.baseURL,
    model: env.MODEL?.trim() || defaults.model,
    thinkingEnabled:
      typeof settings?.thinkingEnabled === "boolean"
        ? settings.thinkingEnabled
        : String(env.THINKING ?? "").toLowerCase() === "enabled",
    notify: notify || undefined,
    webSearchTool: webSearchTool || undefined
  };
}
