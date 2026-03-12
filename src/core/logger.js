const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "refreshToken",
  "authorization",
  "accessToken",
]);

const LOG_LEVELS = ["debug", "info", "warn", "error"];

const isPlainObject = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const redactValue = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeMetadata(item));
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const sanitized = {};
  for (const [key, nestedValue] of Object.entries(value)) {
    sanitized[key] = SENSITIVE_KEYS.has(key) ? "[redacted]" : sanitizeMetadata(nestedValue);
  }

  return sanitized;
};

export const sanitizeMetadata = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeMetadata(item));
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
    };
  }

  if (!isPlainObject(value)) {
    return value;
  }

  return redactValue(value);
};

export const isDevLogsEnabled = () => Boolean(window.PROODOS_CONFIG?.DEV_LOGS);

const resolveConsoleMethod = (level) => {
  if (LOG_LEVELS.includes(level) && typeof console[level] === "function") {
    return console[level].bind(console);
  }

  return console.log.bind(console);
};

export const createLogger = (scope) => {
  const log = (level, message, metadata) => {
    if (!isDevLogsEnabled()) {
      return;
    }

    const consoleMethod = resolveConsoleMethod(level);
    const prefix = `[Proodos][${scope}] ${message}`;

    if (metadata === undefined) {
      consoleMethod(prefix);
      return;
    }

    consoleMethod(prefix, sanitizeMetadata(metadata));
  };

  return {
    debug(message, metadata) {
      log("debug", message, metadata);
    },
    info(message, metadata) {
      log("info", message, metadata);
    },
    warn(message, metadata) {
      log("warn", message, metadata);
    },
    error(message, metadata) {
      log("error", message, metadata);
    },
  };
};
