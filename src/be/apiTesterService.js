import { executeApiTesterRequestUseCase } from "../use-cases/apiTester/executeApiTesterRequestUseCase.js";

export class ApiTesterService {
  constructor(httpClient, authService, config) {
    this.httpClient = httpClient;
    this.authService = authService;
    this.authBase = config.AUTH_API_BASE.replace(/\/+$/, "");
    this.beBase = config.BE_API_BASE.replace(/\/+$/, "");
  }

  async execute({ base, method, path, body, includeToken }) {
    return executeApiTesterRequestUseCase({
      httpClient: this.httpClient,
      authService: this.authService,
      authBase: this.authBase,
      beBase: this.beBase,
      input: { base, method, path, body, includeToken },
    });
  }
}
