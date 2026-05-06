async function parseBody(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

/**
 * @param {string} path - 例如 /api/...
 * @param {RequestInit & { json?: unknown }} [options]
 */
export async function request(path, options = {}) {
  const { json, headers, ...rest } = options;
  const mergedHeaders = new Headers(headers);
  let body = rest.body;
  if (json !== undefined) {
    mergedHeaders.set("Content-Type", "application/json");
    body = JSON.stringify(json);
  }
  const res = await fetch(path, { ...rest, headers: mergedHeaders, body });
  const data = await parseBody(res);
  if (!res.ok) {
    const msg = typeof data?.message === "string" ? data.message : `请求失败 (${res.status})`;
    throw new Error(msg);
  }
  return data;
}