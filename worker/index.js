const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
};

const TOKEN_PATTERN = /^[0-9a-f]{64}$/;
const MAX_BODY_SIZE = 64 * 1024; // 64 KB

function jsonResponse(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS, ...extraHeaders },
  });
}

function validateToken(request) {
  const auth = request.headers.get("Authorization");
  if (!auth) {
    return { error: jsonResponse({ error: "Missing authorization" }, 401) };
  }
  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return { error: jsonResponse({ error: "Invalid token format" }, 401) };
  }
  const token = parts[1];
  if (!TOKEN_PATTERN.test(token)) {
    return { error: jsonResponse({ error: "Invalid token format" }, 401) };
  }
  return { token };
}

async function handleGet(env, token) {
  try {
    const value = await env.COMPLETION_STATE.get(token);
    if (value === null) {
      return jsonResponse({}, 200);
    }
    return new Response(value, {
      status: 200,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  } catch {
    return jsonResponse({ error: "Storage unavailable" }, 503);
  }
}

async function handlePut(request, env, token) {
  let body;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > MAX_BODY_SIZE) {
      return jsonResponse({ error: "Request body too large" }, 400);
    }
    body = JSON.parse(text);
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  try {
    await env.COMPLETION_STATE.put(token, JSON.stringify(body));
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  } catch {
    return jsonResponse({ error: "Storage unavailable" }, 503);
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Only handle /api/ paths — return 404 for everything else
    if (!url.pathname.startsWith("/api/")) {
      return new Response("Not Found", { status: 404 });
    }

    // Only /api/progress is a valid endpoint
    if (url.pathname !== "/api/progress") {
      return new Response("Not Found", { status: 404 });
    }

    const method = request.method.toUpperCase();

    // Handle CORS preflight
    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Only GET and PUT are supported
    if (method !== "GET" && method !== "PUT") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    // Validate authorization token
    const { token, error } = validateToken(request);
    if (error) {
      return error;
    }

    if (method === "GET") {
      return handleGet(env, token);
    }

    return handlePut(request, env, token);
  },
};
