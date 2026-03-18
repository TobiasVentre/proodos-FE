import { createLogger } from "../../../shared/infrastructure/logger.js";
import { executeGetValidTokenUseCase } from "./use-cases/getValidTokenUseCase.js";
import { executeLoginUseCase } from "./use-cases/loginUseCase.js";
import { executeLogoutUseCase } from "./use-cases/logoutUseCase.js";
import { executeRefreshSessionUseCase } from "./use-cases/refreshSessionUseCase.js";
import { executeRestoreSessionUseCase } from "./use-cases/restoreSessionUseCase.js";

const logger = createLogger("authService");

export class AuthService {
  constructor(authApi, sessionStore) {
    this.authApi = authApi;
    this.sessionStore = sessionStore;
  }

  async login(credentials) {
    logger.info("login:start", { username: credentials?.username ?? null });
    return executeLoginUseCase({
      authApi: this.authApi,
      sessionStore: this.sessionStore,
      credentials,
    });
  }

  async refreshIfPossible() {
    logger.info("refresh:start");
    return executeRefreshSessionUseCase({
      authApi: this.authApi,
      sessionStore: this.sessionStore,
    });
  }

  getToken() {
    return this.sessionStore.getToken();
  }

  getUser() {
    return this.sessionStore.getUser();
  }

  hasActiveUser() {
    return Boolean(this.getUser());
  }

  async getValidToken() {
    logger.debug("token:get-valid");
    return executeGetValidTokenUseCase({
      authApi: this.authApi,
      sessionStore: this.sessionStore,
    });
  }

  async restoreSession() {
    logger.info("session:restore:start");
    return executeRestoreSessionUseCase({
      authApi: this.authApi,
      sessionStore: this.sessionStore,
    });
  }

  isLogged() {
    return Boolean(this.getToken() && this.getUser());
  }

  async logout() {
    logger.info("logout:start");
    return executeLogoutUseCase({
      authApi: this.authApi,
      sessionStore: this.sessionStore,
    });
  }
}
