import { createLogger } from "../../core/logger.js";

const logger = createLogger("authFeature");

export const createAuthFeature = ({
  elements,
  screen,
  authService,
  onAuthenticated,
  onLoggedOut,
}) => {
  const bind = () => {
    elements.loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      screen.setLoginLoading(true);

      const formData = new FormData(elements.loginForm);
      const credentials = {
        username: String(formData.get("username") || ""),
        password: String(formData.get("password") || ""),
      };
      logger.info("login:submit", {
        username: credentials.username,
      });

      try {
        const session = await authService.login(credentials);
        logger.info("login:success", {
          user: session?.user ? { username: session.user.username, roles: session.user.roles } : null,
        });
        screen.showApp(session.user);
        await onAuthenticated({ session, restored: false });
      } catch (error) {
        const message = error instanceof Error ? error.message : "No se pudo iniciar sesión.";
        logger.error("login:error", { message });
        screen.showLogin(`No se pudo iniciar sesion: ${message}`);
        screen.setResponse({ status: "error", message });
      } finally {
        screen.setLoginLoading(false);
      }
    });

    elements.logoutBtn.addEventListener("click", async () => {
      logger.info("logout:start");
      await authService.logout();
      screen.showLogin("Sesion cerrada.");
      await onLoggedOut({ reason: "logout" });
      logger.info("logout:complete");
    });
  };

  const init = async () => {
    logger.info("init:start");
    const session = await authService.restoreSession();

    if (session) {
      logger.info("session:restored", {
        user: session?.user ? { username: session.user.username, roles: session.user.roles } : null,
      });
      screen.showApp(session.user);
      await onAuthenticated({ session, restored: true });
      return;
    }

    logger.debug("session:not-found");
    screen.showLogin();
    await onLoggedOut({ reason: "init" });
  };

  return {
    bind,
    init,
  };
};
