const JWT_EXPIRY_SKEW_MS = 30_000;

const decodeJwtPayload = (token) => {
  try {
    const [, payloadSegment] = String(token ?? "").split(".");
    if (!payloadSegment) {
      return null;
    }

    const normalizedPayload = payloadSegment
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payloadSegment.length / 4) * 4, "=");

    return JSON.parse(atob(normalizedPayload));
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") {
    return false;
  }

  return payload.exp * 1000 <= Date.now() + JWT_EXPIRY_SKEW_MS;
};
