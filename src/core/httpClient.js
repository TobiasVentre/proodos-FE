import { createLogger } from "./logger.js";

const logger = createLogger("httpClient");

export class HttpError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.details = details;
  }
}

const isJsonContent = (contentType) =>
  Boolean(contentType && contentType.includes("application/json"));

export class HttpClient {
  async request({ method, url, headers = {}, body }) {
    logger.debug("request:start", {
      method,
      url,
      headers,
      hasBody: body !== undefined,
    });

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      body: body !== undefined ? JSON.stringify(body) : undefined
    });

    const contentType = response.headers.get("content-type");
    const payload = isJsonContent(contentType) ? await response.json() : await response.text();

    if (!response.ok) {
      const message =
        typeof payload === "object" && payload !== null && "message" in payload
          ? String(payload.message)
          : `HTTP error ${response.status}`;
      logger.error("request:error", {
        method,
        url,
        status: response.status,
        message,
        contentType,
        payload,
      });
      throw new HttpError(message, response.status, payload);
    }

    logger.info("request:success", {
      method,
      url,
      status: response.status,
      contentType,
    });
    return payload;
  }
}
