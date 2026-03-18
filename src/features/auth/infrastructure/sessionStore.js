import { createLogger } from "../../../shared/infrastructure/logger.js";

const TOKEN_KEY = "proodos.token";
const REFRESH_TOKEN_KEY = "proodos.refreshToken";
const USER_KEY = "proodos.user";
const logger = createLogger("sessionStore");

const isMeaningfulStorageValue = (value) =>
  value !== null && value !== undefined && value !== "" && value !== "undefined" && value !== "null";

export class SessionStore {
  constructor(storage = window.sessionStorage, legacyStorage = window.localStorage) {
    this.storage = storage;
    this.legacyStorage = legacyStorage;
    this.didMigrateLegacySession = false;
  }

  save(session) {
    logger.info("session:save", {
      hasToken: Boolean(session?.token),
      hasRefreshToken: Boolean(session?.refreshToken),
      user: session?.user ? { username: session.user.username, roles: session.user.roles } : null,
    });
    this.migrateLegacySession();
    this.writeValue(this.storage, TOKEN_KEY, session?.token);
    this.writeValue(this.storage, REFRESH_TOKEN_KEY, session?.refreshToken);
    this.writeValue(
      this.storage,
      USER_KEY,
      session?.user ? JSON.stringify(session.user) : null
    );
    this.removeLegacySession();
  }

  getToken() {
    return this.readValue(TOKEN_KEY);
  }

  getRefreshToken() {
    return this.readValue(REFRESH_TOKEN_KEY);
  }

  getUser() {
    const raw = this.readValue(USER_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch {
      this.storage.removeItem(USER_KEY);
      return null;
    }
  }

  clear() {
    logger.info("session:clear");
    this.storage.removeItem(TOKEN_KEY);
    this.storage.removeItem(REFRESH_TOKEN_KEY);
    this.storage.removeItem(USER_KEY);
    this.removeLegacySession();
  }

  readValue(key) {
    this.migrateLegacySession();

    const value = this.storage.getItem(key);
    return isMeaningfulStorageValue(value) ? value : null;
  }

  writeValue(storage, key, value) {
    if (!isMeaningfulStorageValue(value)) {
      storage.removeItem(key);
      return;
    }

    storage.setItem(key, String(value));
  }

  migrateLegacySession() {
    if (this.didMigrateLegacySession) {
      return;
    }

    this.didMigrateLegacySession = true;

    for (const key of [TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]) {
      const primaryValue = this.storage.getItem(key);
      if (isMeaningfulStorageValue(primaryValue)) {
        continue;
      }

      const legacyValue = this.legacyStorage.getItem(key);
      if (isMeaningfulStorageValue(legacyValue)) {
        logger.info("session:migrate-legacy-key", { key });
        this.storage.setItem(key, legacyValue);
      }
    }

    this.removeLegacySession();
  }

  removeLegacySession() {
    this.legacyStorage.removeItem(TOKEN_KEY);
    this.legacyStorage.removeItem(REFRESH_TOKEN_KEY);
    this.legacyStorage.removeItem(USER_KEY);
  }
}
