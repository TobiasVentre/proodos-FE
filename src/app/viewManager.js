import { createLogger } from "../core/logger.js";

const pickFirst = (values) => values.values().next().value ?? null;
const logger = createLogger("viewManager");

export class ViewManager {
  constructor(screen, { defaultView, viewHashByName }) {
    this.screen = screen;
    this.defaultView = defaultView;
    this.viewHashByName = { ...viewHashByName };
    this.views = new Map();
    this.allowedViews = new Set(Object.keys(viewHashByName));
    this.skipNextHashChange = false;
  }

  registerView(viewName, { onEnter } = {}) {
    this.views.set(viewName, { onEnter });
    logger.debug("view:register", { viewName, hasOnEnter: Boolean(onEnter) });
    if (!this.allowedViews.has(viewName)) {
      this.allowedViews.add(viewName);
    }
  }

  setAllowedViews(viewNames = []) {
    this.allowedViews = new Set(viewNames);
    if (!this.allowedViews.has(this.defaultView)) {
      this.allowedViews.add(this.defaultView);
    }
    logger.debug("views:set-allowed", {
      allowedViews: Array.from(this.allowedViews),
    });
  }

  resolveViewFromHash() {
    const matchedView =
      Object.entries(this.viewHashByName).find(([, hash]) => window.location.hash === hash)?.[0] ??
      this.defaultView;

    return this.getSafeViewName(matchedView);
  }

  async setView(viewName, { updateHash = true } = {}) {
    const nextView = this.getSafeViewName(viewName);
    logger.info("view:set", {
      requestedView: viewName,
      resolvedView: nextView,
      updateHash,
    });

    if (updateHash) {
      this.updateHash(nextView);
    }

    this.screen.setActiveView(nextView);

    const handler = this.views.get(nextView)?.onEnter;
    if (handler) {
      await handler();
    }

    return nextView;
  }

  async handleHashChange() {
    if (this.skipNextHashChange) {
      this.skipNextHashChange = false;
      logger.debug("hashchange:skip-next");
      return null;
    }

    logger.debug("hashchange:resolved", {
      hash: window.location.hash,
      nextView: this.resolveViewFromHash(),
    });
    return this.setView(this.resolveViewFromHash(), { updateHash: false });
  }

  clearHash() {
    this.skipNextHashChange = false;
    if (window.location.hash) {
      logger.debug("hash:clear", { previousHash: window.location.hash });
      window.location.hash = "";
    }
  }

  getSafeViewName(viewName) {
    if (viewName && this.views.has(viewName) && this.allowedViews.has(viewName)) {
      return viewName;
    }

    if (this.views.has(this.defaultView) && this.allowedViews.has(this.defaultView)) {
      return this.defaultView;
    }

    const firstAllowedView = pickFirst(this.allowedViews);
    if (firstAllowedView && this.views.has(firstAllowedView)) {
      return firstAllowedView;
    }

    return pickFirst(this.views) ?? this.defaultView;
  }

  updateHash(viewName) {
    const nextHash = this.viewHashByName[viewName] || this.viewHashByName[this.defaultView] || "";
    if (window.location.hash !== nextHash) {
      this.skipNextHashChange = true;
      logger.debug("hash:update", {
        previousHash: window.location.hash,
        nextHash,
      });
      window.location.hash = nextHash;
    }
  }
}
