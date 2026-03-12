import { executeListLandingsUseCase } from "../use-cases/landings/listLandingsUseCase.js";

export class LandingCatalogService {
  constructor(httpClient, authService, config) {
    this.httpClient = httpClient;
    this.authService = authService;
    this.beBase = config.BE_API_BASE.replace(/\/+$/, "");
  }

  async listLandings() {
    return executeListLandingsUseCase({
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }
}
