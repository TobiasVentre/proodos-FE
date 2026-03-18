import { PreviewEngine } from "../../preview/infrastructure/previewEngine.js";
import { executeGenerateComponentPreviewUseCase } from "../../preview/application/use-cases/generateComponentPreviewUseCase.js";

export class ComponentPreviewService {
  constructor(config) {
    this.previewEngine = new PreviewEngine(config);
  }

  async generate(detail) {
    return executeGenerateComponentPreviewUseCase({
      detail,
      previewEngine: this.previewEngine,
    });
  }
}
