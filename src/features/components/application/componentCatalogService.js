import { executeGetComponenteDetailUseCase } from "./use-cases/getComponenteDetailUseCase.js";
import { executeListComponentesUseCase } from "./use-cases/listComponentesUseCase.js";

export class ComponentCatalogService {
  constructor(httpClient, authService, config) {
    this.httpClient = httpClient;
    this.authService = authService;
    this.beBase = config.BE_API_BASE.replace(/\/+$/, "");
  }

  async listComponentes() {
    return executeListComponentesUseCase({
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }

  async getComponenteDetail(componentIdInput) {
    return executeGetComponenteDetailUseCase({
      componentIdInput,
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }
}
