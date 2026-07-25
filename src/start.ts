import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(self)",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
};

function applySecurityHeaders(response: Response): Response {
  try {
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
      if (!response.headers.has(k)) response.headers.set(k, v);
    }
  } catch {
    // headers immutable on some responses — ignore
  }
  return response;
}

const securityHeadersMiddleware = createMiddleware().server(async ({ next }) => {
  const response = await next();
  if (response instanceof Response) return applySecurityHeaders(response);
  return response;
});

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    const response = await next();
    return response;
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return applySecurityHeaders(
      new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      }),
    );
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [securityHeadersMiddleware, errorMiddleware],
}));
