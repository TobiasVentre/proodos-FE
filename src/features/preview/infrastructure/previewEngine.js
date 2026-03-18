import { PreviewAssetPolicy } from "./previewAssetPolicy.js";
import { sanitizePreviewTemplate } from "./previewTemplateSanitizer.js";

const CONTENT_SECURITY_POLICY =
  "default-src 'none'; img-src http: https: data: blob:; style-src 'unsafe-inline' http: https:; font-src http: https: data:; form-action 'none'; connect-src 'none'; base-uri 'none';";

const DEFAULT_ROOT_VARIABLES = {
  "--brandLow": "#eaf7f2",
  "--infoHigh": "#0f7a5f",
  "--textPrimary": "#1a3228",
  "--textSecondary": "#557568",
};

const serializeRootVariables = (rootVariables = {}) =>
  Object.entries({
    ...DEFAULT_ROOT_VARIABLES,
    ...rootVariables,
  })
    .map(([name, value]) => `${name}: ${value};`)
    .join("\n            ");

export const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const buildCssLinks = (cssUrls = []) =>
  cssUrls.map((url) => `<link rel="stylesheet" href="${escapeHtml(url)}">`).join("\n");

const buildWarningMarkup = ({ warnings = [], alertClass, warningTitle }) =>
  warnings.length
    ? `
        <aside class="${alertClass}">
          <strong>${escapeHtml(warningTitle)}</strong>
          <ul>
            ${warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}
          </ul>
        </aside>
      `
    : "";

const buildDocumentStyles = ({
  shellClass,
  headerClass,
  contentClass,
  alertClass,
  shellStyles = "",
  headerStyles = "",
  contentStyles = "",
  alertStyles = "",
  extraStyles = "",
  rootVariables = {},
}) => `
          :root {
            color-scheme: light;
            ${serializeRootVariables(rootVariables)}
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: "Segoe UI", Tahoma, sans-serif;
            background:
              radial-gradient(circle at top left, rgba(15, 122, 95, 0.08), transparent 28%),
              linear-gradient(180deg, #f7fbf9, #edf5f1);
            color: #173228;
          }

          .${shellClass} {
            ${shellStyles}
          }

          .${headerClass} {
            background: rgba(255, 255, 255, 0.86);
            border: 1px solid rgba(15, 122, 95, 0.14);
            border-radius: 18px;
            padding: 18px 20px;
            margin-bottom: 18px;
            ${headerStyles}
          }

          .${headerClass} h1 {
            margin: 0 0 8px;
            font-size: 28px;
          }

          .${headerClass} p {
            margin: 0;
            color: #557568;
          }

          .${alertClass} {
            border: 1px solid #f0c36d;
            background: #fff6e2;
            color: #6f5316;
            border-radius: 14px;
            padding: 14px 16px;
            margin-bottom: 18px;
            ${alertStyles}
          }

          .${alertClass} strong {
            display: block;
            margin-bottom: 8px;
          }

          .${alertClass} ul {
            margin: 0;
            padding-left: 18px;
          }

          .${contentClass} {
            display: grid;
            gap: 18px;
            ${contentStyles}
          }

          ${extraStyles}
        `;

export class PreviewEngine {
  constructor(config) {
    this.assetPolicy = new PreviewAssetPolicy(config);
  }

  resolveAssetUrl(assetPath, { assetType }) {
    return this.assetPolicy.resolve(assetPath, { assetType });
  }

  async loadTemplate(url, { log, context = {} } = {}) {
    log?.("asset:template:request", {
      url,
      ...context,
    });

    const response = await fetch(url, {
      headers: { Accept: "text/html, text/plain, */*" },
    });

    log?.("asset:template:response", {
      url,
      status: response.status,
      ok: response.ok,
      ...context,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType && !contentType.includes("text/html") && !contentType.includes("text/plain")) {
      throw new Error("El template no devolvió un tipo de contenido permitido.");
    }

    const template = sanitizePreviewTemplate(await response.text());

    log?.("asset:template:loaded", {
      url,
      length: template.length,
      ...context,
    });

    return template;
  }

  hydrateTemplate(template, placeholders = {}) {
    return String(template ?? "").replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => {
      if (!(key in placeholders)) {
        return match;
      }

      return escapeHtml(placeholders[key]);
    });
  }

  buildDocument({
    title,
    subtitle = "",
    cssUrls = [],
    warnings = [],
    warningTitle = "Advertencias del preview",
    shellClass,
    headerClass,
    contentClass,
    alertClass,
    contentMarkup,
    shellStyles = "",
    headerStyles = "",
    contentStyles = "",
    alertStyles = "",
    extraStyles = "",
    rootVariables = {},
  }) {
    const safeTitle = escapeHtml(title);
    const safeSubtitle = escapeHtml(subtitle);
    const warningMarkup = buildWarningMarkup({
      warnings,
      alertClass,
      warningTitle,
    });
    const cssLinks = buildCssLinks(cssUrls);

    return `
      <!doctype html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="${CONTENT_SECURITY_POLICY}">
        <title>${safeTitle}</title>
        ${cssLinks}
        <style>
${buildDocumentStyles({
  shellClass,
  headerClass,
  contentClass,
  alertClass,
  shellStyles,
  headerStyles,
  contentStyles,
  alertStyles,
  extraStyles,
  rootVariables,
})}
        </style>
      </head>
      <body>
        <main class="${shellClass}">
          <header class="${headerClass}">
            <h1>${safeTitle}</h1>
            ${safeSubtitle ? `<p>${safeSubtitle}</p>` : ""}
          </header>
          ${warningMarkup}
          <div class="${contentClass}">
            ${contentMarkup}
          </div>
        </main>
      </body>
      </html>
    `;
  }
}
