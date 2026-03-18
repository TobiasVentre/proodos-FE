import { createLogger } from "../../../shared/infrastructure/logger.js";

const logger = createLogger("apiTesterFeature");

export const createApiTesterFeature = ({ elements, screen, apiTesterService }) => {
  const bind = () => {
    elements.requestForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      screen.setRequestLoading(true);

      try {
        const formData = new FormData(elements.requestForm);
        const requestInput = {
          base: String(formData.get("base") || "BE"),
          method: String(formData.get("method") || "GET"),
          path: String(formData.get("path") || "/health"),
          body: String(formData.get("body") || ""),
          includeToken: Boolean(elements.includeToken.checked),
        };
        logger.info("request:start", {
          base: requestInput.base,
          method: requestInput.method,
          path: requestInput.path,
          includeToken: requestInput.includeToken,
          hasBody: Boolean(requestInput.body),
        });

        const result = await apiTesterService.execute(requestInput);
        logger.info("request:success", {
          base: requestInput.base,
          method: requestInput.method,
          path: requestInput.path,
        });
        screen.setResponse(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : "No se pudo ejecutar el request.";
        logger.error("request:error", { message });
        screen.setResponse({
          status: "error",
          response: { message },
        });
      } finally {
        screen.setRequestLoading(false);
      }
    });
  };

  const reset = () => {
    logger.debug("reset");
    screen.setRequestLoading(false);
    screen.setResponse({ message: "Esperando request." });
  };

  return {
    bind,
    reset,
  };
};
