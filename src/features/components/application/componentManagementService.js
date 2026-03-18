import { executeAssignComponenteHijoUseCase } from "./use-cases/assignComponenteHijoUseCase.js";
import { executeAssignComponenteToLandingUseCase } from "./use-cases/assignComponenteToLandingUseCase.js";
import { executeCreateElementoComponenteUseCase } from "./use-cases/createElementoComponenteUseCase.js";
import { executeCreateComponenteUseCase } from "./use-cases/createComponenteUseCase.js";
import { executeListLandingsUseCase } from "./use-cases/listLandingsUseCase.js";
import { executeListPlanesUseCase } from "./use-cases/listPlanesUseCase.js";
import { executeListTiposElementoUseCase } from "./use-cases/listTiposElementoUseCase.js";
import { executeLoadCreateComponenteFormUseCase } from "./use-cases/loadCreateComponenteFormUseCase.js";
import { executeListTiposVariacionUseCase } from "./use-cases/listTiposVariacionUseCase.js";
import { executeUnassignComponenteFromLandingUseCase } from "./use-cases/unassignComponenteFromLandingUseCase.js";
import { executeUpdateComponenteRelationsUseCase } from "./use-cases/updateComponenteRelationsUseCase.js";
import { executeUpdateElementoComponenteUseCase } from "./use-cases/updateElementoComponenteUseCase.js";

export class ComponentManagementService {
  constructor(httpClient, authService, config) {
    this.httpClient = httpClient;
    this.authService = authService;
    this.beBase = config.BE_API_BASE.replace(/\/+$/, "");
  }

  async loadCreateFormData() {
    return executeLoadCreateComponenteFormUseCase({
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }

  async listTiposVariacion(idTipoComponenteInput) {
    return executeListTiposVariacionUseCase({
      idTipoComponenteInput,
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }

  async listPlanes() {
    return executeListPlanesUseCase({
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }

  async listLandings() {
    return executeListLandingsUseCase({
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }

  async listTiposElemento() {
    return executeListTiposElementoUseCase({
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }

  async createComponente(input) {
    return executeCreateComponenteUseCase({
      input,
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }

  async assignComponenteHijo(input) {
    return executeAssignComponenteHijoUseCase({
      input,
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }

  async createElementoComponente(input) {
    return executeCreateElementoComponenteUseCase({
      input,
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }

  async updateElementoComponente(input) {
    return executeUpdateElementoComponenteUseCase({
      input,
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }

  async updateComponenteRelations(input) {
    return executeUpdateComponenteRelationsUseCase({
      input,
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }

  async assignComponenteToLanding(input) {
    return executeAssignComponenteToLandingUseCase({
      input,
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }

  async unassignComponenteFromLanding(input) {
    return executeUnassignComponenteFromLandingUseCase({
      input,
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }
}
