import { AppShellScreenController } from "./ui/controllers/appShellScreenController.js";
import { LandingsScreenController } from "../../features/landings/presentation/landingsScreenController.js";
import { ComponentsScreenController } from "../../features/components/presentation/componentsScreenController.js";
import { VariationsScreenController } from "../../features/variations/presentation/variationsScreenController.js";
import { PlansScreenController } from "../../features/plans/presentation/plansScreenController.js";
import { PreviewScreenController } from "../../features/preview/presentation/previewScreenController.js";

export class ScreenController {
  constructor(elements) {
    this.appShell = new AppShellScreenController(elements);
    this.landings = new LandingsScreenController(elements);
    this.components = new ComponentsScreenController(elements);
    this.variations = new VariationsScreenController(elements);
    this.plans = new PlansScreenController(elements);
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

  setPreviewExportCode(documentHtml = "") {
    this.preview.setPreviewExportCode(documentHtml);
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

  renderLandingList(payload = []) {
    this.landings.renderLandingList(payload);
  }

  setComponentsLoading(loading) {
    this.components.setComponentsLoading(loading);
  }

  setComponentsStatus(message = "") {
    this.components.setComponentsStatus(message);
  }

  setVariationsLoading(loading) {
    this.variations.setVariationsLoading(loading);
  }

  setVariationsStatus(message = "") {
    this.variations.setVariationsStatus(message);
  }

  setPlansLoading(loading) {
    this.plans.setPlansLoading(loading);
  }

  setPlansStatus(message = "") {
    this.plans.setPlansStatus(message);
  }

  showPlansListView() {
    this.plans.showPlansListView();
  }

  showPlanDetailView() {
    this.plans.showPlanDetailView();
  }

  setVariationCreateVisible(visible) {
    this.variations.setVariationCreateVisible(visible);
  }

  renderVariationFilterOptions(payload) {
    this.variations.renderVariationFilterOptions(payload);
  }

  renderVariationCreateFormOptions(payload) {
    this.variations.renderVariationCreateFormOptions(payload);
  }

  setVariationCreateStatus(message = "") {
    this.variations.setVariationCreateStatus(message);
  }

  setVariationCreateLoading(loading) {
    this.variations.setVariationCreateLoading(loading);
  }

  resetVariationCreateForm() {
    this.variations.resetVariationCreateForm();
  }

  renderVariationList(payload) {
    this.variations.renderVariationList(payload);
  }

  setVariationEditStatus(variationId, message = "") {
    this.variations.setVariationEditStatus(variationId, message);
  }

  setVariationEditLoading(variationId, loading) {
    this.variations.setVariationEditLoading(variationId, loading);
  }

  renderPlanList(payload) {
    this.plans.renderPlanList(payload);
  }

  renderPlanSegmentFilterOptions(payload) {
    this.plans.renderPlanSegmentFilterOptions(payload);
  }

  setPlanDetailStatus(message = "") {
    this.plans.setPlanDetailStatus(message);
  }

  clearPlanDetail(message = "Seleccioná un plan para ver el detalle.") {
    this.plans.clearPlanDetail(message);
  }

  renderPlanDetail(payload) {
    this.plans.renderPlanDetail(payload);
  }

  setPlanEditStatus(message = "") {
    this.plans.setPlanEditStatus(message);
  }

  setPlanEditLoading(loading) {
    this.plans.setPlanEditLoading(loading);
  }

  showComponentsListView() {
    this.components.showComponentsListView();
  }

  showComponentDetailView() {
    this.components.showComponentDetailView();
  }

  showComponentCreateView() {
    this.components.showComponentCreateView();
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

  renderComponentCreateFormOptions(payload) {
    this.components.renderComponentCreateFormOptions(payload);
  }

  setComponentCreateStatus(message = "") {
    this.components.setComponentCreateStatus(message);
  }

  setComponentCreateLoading(loading) {
    this.components.setComponentCreateLoading(loading);
  }

  renderComponentVariationEditOptions(payload) {
    this.components.renderComponentVariationEditOptions(payload);
  }

  renderComponentPlanEditOptions(payload) {
    this.components.renderComponentPlanEditOptions(payload);
  }

  renderComponentLandingAssignOptions(payload) {
    this.components.renderComponentLandingAssignOptions(payload);
  }

  renderComponentChildAssignOptions(payload) {
    this.components.renderComponentChildAssignOptions(payload);
  }

  renderComponentElementCreateOptions(payload) {
    this.components.renderComponentElementCreateOptions(payload);
  }

  setComponentVariationEditStatus(message = "") {
    this.components.setComponentVariationEditStatus(message);
  }

  setComponentPlanEditStatus(message = "") {
    this.components.setComponentPlanEditStatus(message);
  }

  setComponentLandingAssignStatus(message = "") {
    this.components.setComponentLandingAssignStatus(message);
  }

  setComponentChildAssignStatus(message = "") {
    this.components.setComponentChildAssignStatus(message);
  }

  setComponentChildrenSelectorEditStatus(message = "") {
    this.components.setComponentChildrenSelectorEditStatus(message);
  }

  setComponentElementCreateStatus(message = "") {
    this.components.setComponentElementCreateStatus(message);
  }

  setComponentElementSelectorEditStatus(elementId, message = "") {
    this.components.setComponentElementSelectorEditStatus(elementId, message);
  }

  setComponentVariationEditLoading(loading) {
    this.components.setComponentVariationEditLoading(loading);
  }

  setComponentPlanEditLoading(loading) {
    this.components.setComponentPlanEditLoading(loading);
  }

  setComponentLandingAssignLoading(loading) {
    this.components.setComponentLandingAssignLoading(loading);
  }

  setComponentChildAssignLoading(loading) {
    this.components.setComponentChildAssignLoading(loading);
  }

  setComponentChildrenSelectorEditLoading(loading) {
    this.components.setComponentChildrenSelectorEditLoading(loading);
  }

  setComponentElementCreateLoading(loading) {
    this.components.setComponentElementCreateLoading(loading);
  }

  setComponentElementSelectorEditLoading(elementId, loading) {
    this.components.setComponentElementSelectorEditLoading(elementId, loading);
  }

  setComponentLandingAssignVisible(visible) {
    this.components.setComponentLandingAssignVisible(visible);
  }

  setComponentChildAssignVisible(visible) {
    this.components.setComponentChildAssignVisible(visible);
  }

  setComponentElementCreateVisible(visible) {
    this.components.setComponentElementCreateVisible(visible);
  }

  resetComponentCreateForm() {
    this.components.resetComponentCreateForm();
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
