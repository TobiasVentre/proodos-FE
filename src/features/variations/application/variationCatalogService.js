import { executeListVariationsUseCase } from "./use-cases/listVariationsUseCase.js";
import { executeLoadVariationFiltersUseCase } from "./use-cases/loadVariationFiltersUseCase.js";

export class VariationCatalogService {
  constructor(httpClient, authService, config) {
    this.httpClient = httpClient;
    this.authService = authService;
    this.beBase = config.BE_API_BASE.replace(/\/+$/, "");
  }

  async loadFilters() {
    return executeLoadVariationFiltersUseCase({
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }

  async listVariations(idTipoComponenteInput) {
    return executeListVariationsUseCase({
      idTipoComponenteInput,
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }
}
