import { createLogger } from "../../../shared/infrastructure/logger.js";

const logger = createLogger("navigationFeature");

export const createNavigationFeature = ({
  elements,
  viewManager,
  canNavigate = () => true,
}) => {
  const bind = () => {
    if (!elements.appNav) {
      return;
    }

    elements.appNav.addEventListener("click", async (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const trigger = event.target.closest("[data-view]");
      if (!trigger || !elements.appNav.contains(trigger)) {
        return;
      }

      const navigationAllowed = canNavigate();
      if (trigger.disabled || trigger.classList.contains("hidden") || !navigationAllowed) {
        logger.debug("navigation:blocked", {
          viewName: trigger.dataset.view ?? null,
          disabled: trigger.disabled,
          hidden: trigger.classList.contains("hidden"),
          canNavigate: navigationAllowed,
        });
        return;
      }

      const viewName = trigger.dataset.view;
      if (!viewName) {
        return;
      }

      logger.info("navigation:click", { viewName });
      await viewManager.setView(viewName);
    });
  };

  return {
    bind,
  };
};
