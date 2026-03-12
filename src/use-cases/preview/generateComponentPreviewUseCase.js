import { createLogger } from "../../core/logger.js";

const FALLBACK_BUTTON_LABEL = "Continuar";
const logger = createLogger("componentPreviewUseCase");

const buildComponentMarkup = ({
  previewEngine,
  component,
  tipoComponente,
  tipoVariacion,
  plan,
  elementos,
  template,
}) => {
  const primaryElement = Array.isArray(elementos) && elementos.length > 0 ? elementos[0] : null;
  const placeholders = {
    tag:
      plan?.segmento ||
      tipoComponente?.nombre ||
      tipoVariacion?.nombre ||
      "Preview",
    title: component?.nombre || tipoVariacion?.nombre || "Componente",
    description:
      tipoVariacion?.descripcion ||
      plan?.descripcion_oferta ||
      primaryElement?.descripcion ||
      `Vista previa del componente ${component?.nombre || ""}`.trim(),
    btn:
      plan?.cta_1 ||
      primaryElement?.nombre ||
      FALLBACK_BUTTON_LABEL,
  };

  return previewEngine.hydrateTemplate(template, placeholders);
};

const buildComponentDocument = ({
  previewEngine,
  detail,
  template,
  cssUrls,
  warnings,
}) => {
  const { component, tipoComponente, tipoVariacion, plan, elementos } = detail;
  const title = component?.nombre || tipoVariacion?.nombre || "Preview de componente";
  const hydratedTemplate = buildComponentMarkup({
    previewEngine,
    component,
    tipoComponente,
    tipoVariacion,
    plan,
    elementos,
    template,
  });

  return previewEngine.buildDocument({
    title,
    subtitle: `Tipo: ${tipoComponente?.nombre || "-"} | Variación: ${tipoVariacion?.nombre || "-"}`,
    cssUrls,
    warnings,
    shellClass: "component-preview-shell",
    headerClass: "component-preview-header",
    contentClass: "component-preview-body",
    alertClass: "component-preview-alert",
    contentMarkup: hydratedTemplate,
    rootVariables: {
      "--surface": "#ffffff",
      "--surfaceSoft": "#f8fcfa",
      "--lineSoft": "rgba(15, 122, 95, 0.14)",
    },
    shellStyles: "padding: 20px;",
    headerStyles: `
            background: rgba(255, 255, 255, 0.88);
            padding: 16px 18px;
          `,
    extraStyles: `
          .component-preview-header h1 {
            font-size: 24px;
          }

          .formulario-banner {
            margin-top: 24px;
          }

          .banner-input,
          .inputs_general,
          .inputs_box {
            display: grid;
            gap: 12px;
          }

          .custom-input {
            position: relative;
            padding: 18px 16px 10px;
            border: 1px solid var(--lineSoft);
            border-radius: 16px;
            background: var(--surface);
            box-shadow: 0 10px 20px rgba(15, 61, 48, 0.05);
          }

          .custom-input input,
          .custom-input select {
            width: 100%;
            border: 0;
            outline: 0;
            background: transparent;
            padding: 8px 0 0;
            margin: 0;
            color: var(--textPrimary);
            font: inherit;
            appearance: none;
          }

          .custom-input input::placeholder,
          .custom-input select {
            color: #6f8f82;
          }

          .label-phone,
          .label-operadora {
            position: absolute;
            top: 10px;
            left: 16px;
            margin: 0;
            font-size: 12px;
            line-height: 1;
            font-weight: 700;
            color: #5e7f72;
            background: var(--surface);
            padding-right: 8px;
          }

          .input-focus-hint,
          .select-focus-hint {
            min-height: 16px;
            padding: 0 4px;
            font-size: 12px;
            line-height: 1.4;
            color: var(--textSecondary);
          }

          .form-ic-c2c-submit,
          .btn-primary-kenos,
          .btn-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 48px;
            padding: 0 18px;
            border-radius: 14px;
            font-weight: 700;
            line-height: 1;
          }

          .form-ic-c2c-submit,
          .btn-primary-kenos {
            width: 100%;
            border: 0;
            background: linear-gradient(135deg, #0f7a5f, #0d624d);
            color: #ffffff;
            box-shadow: 0 14px 28px rgba(15, 122, 95, 0.18);
          }

          .btn-link {
            background: var(--surface);
            color: var(--infoHigh);
            border: 1px solid var(--lineSoft);
          }

          .button-group > * {
            flex: 1 1 0;
          }

          .img-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .img-wrapper img {
            display: block;
            max-width: 100%;
            height: auto;
            border-radius: 18px;
            object-fit: cover;
            background: var(--surfaceSoft);
          }

          @media (max-width: 992px) {
            .banner-main .banner-container {
              flex-direction: column;
              padding: 0 20px;
            }

            .banner-main .banner-container .img-wrapper img {
              width: 100%;
            }

            .banner-main .banner-container .text-wrapper .action-wrapper .button-group {
              flex-direction: column;
            }
          }
        `,
  });
};

export const executeGenerateComponentPreviewUseCase = async ({
  detail,
  previewEngine,
}) => {
  logger.info("preview:start", {
    componentId: detail?.component?.id_componente ?? null,
  });

  if (!detail?.component) {
    logger.error("preview:error", { message: "No hay un componente cargado para generar el preview." });
    throw new Error("No hay un componente cargado para generar el preview.");
  }

  const component = detail.component;
  const tipoVariacion = detail.tipoVariacion;
  if (!tipoVariacion) {
    logger.error("preview:error", {
      componentId: component?.id_componente ?? null,
      message: "El componente no tiene un tipo de variación cargado.",
    });
    throw new Error("El componente no tiene un tipo de variación cargado.");
  }

  const templateUrl = previewEngine.resolveAssetUrl(tipoVariacion.html, { assetType: "html" });
  if (!templateUrl) {
    logger.error("preview:error", {
      componentId: component?.id_componente ?? null,
      message: "La variación no tiene ruta HTML configurada.",
    });
    throw new Error("La variación no tiene ruta HTML configurada.");
  }

  const cssUrl = previewEngine.resolveAssetUrl(tipoVariacion.css_url, { assetType: "css" });
  const template = await previewEngine.loadTemplate(templateUrl);
  const warnings = [];

  if (!cssUrl) {
    warnings.push("La variación no tiene CSS configurado.");
  }

  if (tipoVariacion.js_url) {
    warnings.push("El preview del componente no ejecuta JS en esta versión.");
  }

  logger.info("preview:success", {
    componentId: component.id_componente,
    warnings: warnings.length,
    hasCss: Boolean(cssUrl),
  });
  return {
    document: buildComponentDocument({
      previewEngine,
      detail,
      template,
      cssUrls: cssUrl ? [cssUrl] : [],
      warnings,
    }),
    summary: {
      componentId: component.id_componente,
      warnings: warnings.length,
    },
  };
};
