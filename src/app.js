import { getAppElements } from "./app/elements.js";
import { resolveAllowedViews } from "./app/viewAccess.js";
import { ViewManager } from "./app/viewManager.js";
import { HttpClient } from "./core/httpClient.js";
import { createLogger } from "./core/logger.js";
import { AuthApi } from "./auth/authApi.js";
import { SessionStore } from "./auth/sessionStore.js";
import { AuthService } from "./auth/authService.js";
import { ApiTesterService } from "./be/apiTesterService.js";
import { ComponentCatalogService } from "./be/componentCatalogService.js";
import { ComponentPreviewService } from "./be/componentPreviewService.js";
import { LandingCatalogService } from "./be/landingCatalogService.js";
import { LandingPreviewService } from "./be/landingPreviewService.js";
import { ScreenController } from "./ui/screenController.js";
import { createAuthFeature } from "./features/auth/authFeature.js";
import { createApiTesterFeature } from "./features/apiTester/apiTesterFeature.js";
import { createLandingsFeature } from "./features/landings/landingsFeature.js";
import { createComponentsFeature } from "./features/components/componentsFeature.js";
import { createLandingPreviewFeature } from "./features/preview/landingPreviewFeature.js";
import { createNavigationFeature } from "./features/navigation/navigationFeature.js";

const DEFAULT_VIEW = "api-tester";
const VIEW_HASH_BY_NAME = {
  "api-tester": "#api-tester",
  landings: "#landings",
  componentes: "#componentes",
  "preview-landing": "#preview-landing",
};
const logger = createLogger("app");

const config = window.PROODOS_CONFIG || {};
if (!config.AUTH_API_BASE || !config.BE_API_BASE) {
  throw new Error("Falta configurar AUTH_API_BASE y BE_API_BASE en src/config.js");
}
logger.info("config:loaded", {
  authBase: config.AUTH_API_BASE,
  beBase: config.BE_API_BASE,
  devLogs: config.DEV_LOGS,
});

const elements = getAppElements();
const httpClient = new HttpClient();
const sessionStore = new SessionStore();
const authApi = new AuthApi(httpClient, config.AUTH_API_BASE);
const authService = new AuthService(authApi, sessionStore);
const apiTesterService = new ApiTesterService(httpClient, authService, config);
const componentCatalogService = new ComponentCatalogService(httpClient, authService, config);
const componentPreviewService = new ComponentPreviewService(config);
const landingCatalogService = new LandingCatalogService(httpClient, authService, config);
const landingPreviewService = new LandingPreviewService(httpClient, authService, config);
const screen = new ScreenController(elements);
const viewManager = new ViewManager(screen, {
  defaultView: DEFAULT_VIEW,
  viewHashByName: VIEW_HASH_BY_NAME,
});

const previewFeature = createLandingPreviewFeature({
  elements,
  screen,
  landingPreviewService,
});

const landingsFeature = createLandingsFeature({
  elements,
  screen,
  landingCatalogService,
  onOpenPreview: async (landingId) => {
    previewFeature.markReadyForLanding(landingId);
    await viewManager.setView("preview-landing");
  },
});

const componentsFeature = createComponentsFeature({
  elements,
  screen,
  componentCatalogService,
  componentPreviewService,
});

const apiTesterFeature = createApiTesterFeature({
  elements,
  screen,
  apiTesterService,
});

const navigationFeature = createNavigationFeature({
  elements,
  viewManager,
  canNavigate: () => authService.hasActiveUser(),
});

const syncAllowedViews = (user) => {
  const allowedViews = resolveAllowedViews(user);
  logger.debug("views:sync-allowed", {
    user: user ? { username: user.username, roles: user.roles } : null,
    allowedViews,
  });
  viewManager.setAllowedViews(allowedViews);
  screen.setAvailableViews(allowedViews);
};

const resetAuthenticatedFeatures = () => {
  logger.debug("features:reset-authenticated");
  landingsFeature.reset();
  componentsFeature.reset();
  previewFeature.reset();
};

const authFeature = createAuthFeature({
  elements,
  screen,
  authService,
  onAuthenticated: async ({ session, restored }) => {
    logger.info("auth:authenticated", {
      restored,
      user: session?.user ? { username: session.user.username, roles: session.user.roles } : null,
    });
    syncAllowedViews(session.user);
    resetAuthenticatedFeatures();
    previewFeature.setIdleState();

    const initialView = viewManager.resolveViewFromHash();
    logger.debug("views:initial", { initialView, restored });
    await viewManager.setView(initialView, { updateHash: !restored });

    screen.setResponse(
      restored
        ? { message: "Sesion restaurada desde navegador." }
        : { status: "success", message: "Login correcto", user: session.user }
    );
  },
  onLoggedOut: async ({ reason }) => {
    logger.info("auth:logged-out", { reason });
    viewManager.clearHash();
    syncAllowedViews(null);
    resetAuthenticatedFeatures();
    apiTesterFeature.reset();

    if (reason === "logout") {
      screen.setResponse({ message: "Sesion cerrada por usuario." });
      return;
    }

    screen.setResponse({ message: "Esperando request." });
  },
});

viewManager.registerView("api-tester");
viewManager.registerView("landings", {
  onEnter: () => landingsFeature.load(),
});
viewManager.registerView("componentes", {
  onEnter: () => componentsFeature.load(),
});
viewManager.registerView("preview-landing");

authFeature.bind();
apiTesterFeature.bind();
landingsFeature.bind();
componentsFeature.bind();
previewFeature.bind();
navigationFeature.bind();

window.addEventListener("hashchange", () => {
  if (!authService.hasActiveUser()) {
    logger.debug("hashchange:ignored-no-user", { hash: window.location.hash });
    return;
  }

  logger.debug("hashchange:handle", { hash: window.location.hash });
  void viewManager.handleHashChange();
});

const init = async () => {
  logger.info("init:start");
  syncAllowedViews(null);
  apiTesterFeature.reset();
  await authFeature.init();
  logger.info("init:complete", { hash: window.location.hash || null });
};

void init();
