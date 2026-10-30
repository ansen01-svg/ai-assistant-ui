import { API_URL } from "@/lib/config";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// FastAPI errors: {"detail": "text"} or, for 422, {"detail": [{"msg": "..."}]}
async function readErrorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body.detail === "string") return body.detail;
    if (Array.isArray(body.detail))
      return body.detail.map((e: { msg: string }) => e.msg).join(", ");
  } catch {
    // body was not JSON
  }
  return res.statusText || "Request failed";
}

/** Low-level fetch: base URL, cookies, JSON headers, error handling. Returns the raw Response. */
export async function apiRequest(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  // FormData needs the browser-set multipart boundary, so only default to JSON otherwise
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: "include", // send the httpOnly auth cookie
      headers,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError")
      throw error;
    throw new ApiError(0, "Cannot reach the server. Check your connection.");
  }
  if (!res.ok) throw new ApiError(res.status, await readErrorMessage(res));
  return res;
}

/** JSON helper for normal endpoints. */
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await apiRequest(path, init);
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const isUnauthorized = (error: unknown) =>
  error instanceof ApiError && error.status === 401;
