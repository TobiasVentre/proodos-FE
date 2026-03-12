const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);
const ALLOWED_TEMPLATE_EXTENSIONS = new Set([".html", ".htm"]);
const ALLOWED_STYLESHEET_EXTENSIONS = new Set([".css"]);

const normalizeAssetRelativePath = (value) =>
  String(value ?? "")
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");

const normalizeOrigin = (value) =>
  String(value ?? "")
    .trim()
    .replace(/\/+$/, "");

const getPathExtension = (pathname) => {
  const cleanPath = String(pathname ?? "").split("?")[0].split("#")[0].toLowerCase();
  const match = cleanPath.match(/(\.[a-z0-9]+)$/);
  return match ? match[1] : "";
};

const getAllowedExtensions = (assetType) =>
  assetType === "html" ? ALLOWED_TEMPLATE_EXTENSIONS : ALLOWED_STYLESHEET_EXTENSIONS;

export class PreviewAssetPolicy {
  constructor(config) {
    this.previewAssetsBase = (config.PREVIEW_ASSETS_BASE || "./preview-assets").replace(/\/+$/, "");
    this.allowedOrigins = this.buildAllowedOrigins(config);
  }

  resolve(assetPath, { assetType }) {
    const normalizedPath = normalizeAssetRelativePath(assetPath);
    if (!normalizedPath) {
      return null;
    }

    if (/^https?:\/\//i.test(normalizedPath)) {
      return this.validateResolvedUrl(normalizedPath, assetType);
    }

    const relativePath = normalizedPath.startsWith("preview-assets/")
      ? normalizedPath.slice("preview-assets/".length)
      : normalizedPath;
    const assetUrl =
      typeof window === "undefined"
        ? `${this.previewAssetsBase}/${relativePath}`
        : new URL(`${this.previewAssetsBase}/${relativePath}`, window.location.href).href;

    return this.validateResolvedUrl(assetUrl, assetType);
  }

  buildAllowedOrigins(config) {
    const configuredOrigins = Array.isArray(config.PREVIEW_ALLOWED_ORIGINS)
      ? config.PREVIEW_ALLOWED_ORIGINS
      : [];

    const origins = configuredOrigins
      .map(normalizeOrigin)
      .filter(Boolean);

    if (typeof window !== "undefined" && window.location?.origin) {
      origins.unshift(normalizeOrigin(window.location.origin));
    }

    return new Set(origins);
  }

  validateResolvedUrl(assetUrl, assetType) {
    let parsedUrl;

    try {
      parsedUrl = new URL(
        assetUrl,
        typeof window !== "undefined" ? window.location.href : undefined
      );
    } catch {
      throw new Error("La URL del asset de preview no es válida.");
    }

    if (!ALLOWED_PROTOCOLS.has(parsedUrl.protocol)) {
      throw new Error(`El protocolo del asset no está permitido: ${parsedUrl.protocol}`);
    }

    if (this.allowedOrigins.size > 0 && !this.allowedOrigins.has(normalizeOrigin(parsedUrl.origin))) {
      throw new Error(`El origen del asset no está permitido: ${parsedUrl.origin}`);
    }

    const extension = getPathExtension(parsedUrl.pathname);
    if (!getAllowedExtensions(assetType).has(extension)) {
      throw new Error(`La extensión del asset no está permitida para ${assetType}.`);
    }

    return parsedUrl.href;
  }
}
