import { AppShellScreenController } from "./controllers/appShellScreenController.js";
import { LandingsScreenController } from "./controllers/landingsScreenController.js";
import { ComponentsScreenController } from "./controllers/componentsScreenController.js";
import { PreviewScreenController } from "./controllers/previewScreenController.js";

export class ScreenController {
  constructor(elements) {
    this.appShell = new AppShellScreenController(elements);
    this.landings = new LandingsScreenController(elements);
    this.components = new ComponentsScreenController(elements);
    this.preview = new PreviewScreenController(elements);
  }

  showLogin(message = "") {
    this.appShell.showLogin(message);
  }

  showApp(user) {
    this.appShell.showApp(user);
    this.appShell.setActiveView("api-tester");
  }

  setActiveView(viewName) {
    this.appShell.setActiveView(viewName);
  }

  setResponse(payload) {
    this.appShell.setResponse(payload);
  }

  setAvailableViews(viewNames = []) {
    this.appShell.setAvailableViews(viewNames);
  }

  setLoginLoading(loading) {
    this.appShell.setLoginLoading(loading);
  }

  setRequestLoading(loading) {
    this.appShell.setRequestLoading(loading);
  }

  setPreviewLoading(loading) {
    this.preview.setPreviewLoading(loading);
  }

  setPreviewStatus(message = "") {
    this.preview.setPreviewStatus(message);
  }

  setPreviewDocument(documentHtml) {
    this.preview.setPreviewDocument(documentHtml);
  }

  setPreviewDebug(payload) {
    this.preview.setPreviewDebug(payload);
  }

  setLandingsLoading(loading) {
    this.landings.setLandingsLoading(loading);
  }

  setLandingsStatus(message = "") {
    this.landings.setLandingsStatus(message);
  }

  renderLandingList(landings = []) {
    this.landings.renderLandingList(landings);
  }

  setComponentsLoading(loading) {
    this.components.setComponentsLoading(loading);
  }

  setComponentsStatus(message = "") {
    this.components.setComponentsStatus(message);
  }

  renderComponentList(componentes = [], selectedComponentId = null) {
    this.components.renderComponentList(componentes, selectedComponentId);
  }

  setComponentDetailStatus(message = "") {
    this.components.setComponentDetailStatus(message);
  }

  clearComponentDetail(message = "Seleccioná un componente para ver su detalle.") {
    this.components.clearComponentDetail(message);
  }

  setComponentPreviewStatus(message = "") {
    this.preview.setComponentPreviewStatus(message);
  }

  setComponentPreviewDocument(documentHtml = "") {
    this.preview.setComponentPreviewDocument(documentHtml);
  }

  renderComponentDetail(detail) {
    this.components.renderComponentDetail(detail);
  }
}
