import { getAppElements } from "./app/elements.js";
import { resolveAllowedViews } from "./app/viewAccess.js";
import { ViewManager } from "./app/viewManager.js";
import { HttpClient } from "./shared/infrastructure/httpClient.js";
import { createLogger } from "./shared/infrastructure/logger.js";
import { AuthApi } from "./features/auth/infrastructure/authApi.js";
import { SessionStore } from "./features/auth/infrastructure/sessionStore.js";
import { AuthService } from "./features/auth/application/authService.js";
import { ApiTesterService } from "./features/apiTester/application/apiTesterService.js";
import { ComponentCatalogService } from "./features/components/application/componentCatalogService.js";
import { ComponentManagementService } from "./features/components/application/componentManagementService.js";
import { ComponentPreviewService } from "./features/components/application/componentPreviewService.js";
import { LandingCatalogService } from "./features/landings/application/landingCatalogService.js";
import { LandingManagementService } from "./features/landings/application/landingManagementService.js";
import { LandingExportService } from "./features/preview/application/landingExportService.js";
import { LandingPreviewService } from "./features/preview/application/landingPreviewService.js";
import { PlanCatalogService } from "./features/plans/application/planCatalogService.js";
import { PlanManagementService } from "./features/plans/application/planManagementService.js";
import { VariationCatalogService } from "./features/variations/application/variationCatalogService.js";
import { VariationManagementService } from "./features/variations/application/variationManagementService.js";
import { ScreenController } from "./shared/presentation/screenController.js";
import { createAuthFeature } from "./features/auth/presentation/authFeature.js";
import { createApiTesterFeature } from "./features/apiTester/presentation/apiTesterFeature.js";
import { createLandingsFeature } from "./features/landings/presentation/landingsFeature.js";
import { createComponentsFeature } from "./features/components/presentation/componentsFeature.js";
import { createLandingPreviewFeature } from "./features/preview/presentation/landingPreviewFeature.js";
import { createPlansFeature } from "./features/plans/presentation/plansFeature.js";
import { createVariationsFeature } from "./features/variations/presentation/variationsFeature.js";
import { createNavigationFeature } from "./features/navigation/presentation/navigationFeature.js";

const DEFAULT_VIEW = "api-tester";
const VIEW_HASH_BY_NAME = {
  "api-tester": "#api-tester",
  landings: "#landings",
  componentes: "#componentes",
  variaciones: "#variaciones",
  planes: "#planes",
  "preview-landing": "#preview-landing",
};
const logger = createLogger("app");
const SENSITIVE_LOGIN_QUERY_PARAMS = ["username", "password"];

const scrubSensitiveLoginQueryParams = () => {
  const currentUrl = new URL(window.location.href);
  const removedParams = SENSITIVE_LOGIN_QUERY_PARAMS.filter((param) =>
    currentUrl.searchParams.has(param)
  );

  if (!removedParams.length) {
    return;
  }

  for (const param of removedParams) {
    currentUrl.searchParams.delete(param);
  }

  const nextSearch = currentUrl.searchParams.toString();
  const nextUrl = `${currentUrl.pathname}${nextSearch ? `?${nextSearch}` : ""}${currentUrl.hash}`;
  window.history.replaceState(window.history.state, "", nextUrl);

  logger.warn("url:sensitive-query-params-removed", {
    removedParams,
  });
};

scrubSensitiveLoginQueryParams();

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
const componentManagementService = new ComponentManagementService(httpClient, authService, config);
const componentPreviewService = new ComponentPreviewService(config);
const landingCatalogService = new LandingCatalogService(httpClient, authService, config);
const landingManagementService = new LandingManagementService(httpClient, authService, config);
const landingExportService = new LandingExportService(httpClient, authService, config);
const landingPreviewService = new LandingPreviewService(httpClient, authService, config);
const planCatalogService = new PlanCatalogService(httpClient, authService, config);
const planManagementService = new PlanManagementService(httpClient, authService, config);
const variationCatalogService = new VariationCatalogService(httpClient, authService, config);
const variationManagementService = new VariationManagementService(httpClient, authService, config);
const screen = new ScreenController(elements);
const viewManager = new ViewManager(screen, {
  defaultView: DEFAULT_VIEW,
  viewHashByName: VIEW_HASH_BY_NAME,
});

const previewFeature = createLandingPreviewFeature({
  elements,
  screen,
  landingExportService,
  landingPreviewService,
});

const landingsFeature = createLandingsFeature({
  elements,
  screen,
  landingCatalogService,
  landingManagementService,
  onOpenPreview: async (landingId) => {
    previewFeature.markReadyForLanding(landingId);
    await viewManager.setView("preview-landing");
  },
});

const variationsFeature = createVariationsFeature({
  elements,
  screen,
  variationCatalogService,
  variationManagementService,
});

const plansFeature = createPlansFeature({
  elements,
  screen,
  planCatalogService,
  planManagementService,
});

const componentsFeature = createComponentsFeature({
  elements,
  screen,
  componentCatalogService,
  componentManagementService,
  componentPreviewService,
  onOpenVariationCatalog: async ({
    tipoComponenteId,
    variationId,
  }) => {
    variationsFeature.openContext({
      tipoComponenteId,
      variationId,
    });
    await viewManager.setView("variaciones");
  },
  onOpenPlanCatalog: async ({ planId }) => {
    plansFeature.openContext({ planId });
    await viewManager.setView("planes");
  },
  onOpenLandingCatalog: async () => {
    await viewManager.setView("landings");
  },
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
  variationsFeature.reset();
  plansFeature.reset();
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
viewManager.registerView("variaciones", {
  onEnter: () => variationsFeature.load(),
});
viewManager.registerView("planes", {
  onEnter: () => plansFeature.load(),
});
viewManager.registerView("preview-landing");

authFeature.bind();
apiTesterFeature.bind();
landingsFeature.bind();
componentsFeature.bind();
variationsFeature.bind();
plansFeature.bind();
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
