export const normalizeApiData = (payload) =>
  payload && typeof payload === "object" && "data" in payload ? payload.data : payload;
