# Proodos - FE (JS puro)

Frontend basico con `HTML + CSS + JavaScript` sin TypeScript ni Vite.

Incluye:
- Pantalla de login dedicada (simulando flujo real).
- Persistencia de sesion en navegador.
- Panel para testear endpoints Auth y BE.
- Catalogo de landings y componentes separado por feature.
- Preview endurecido con `iframe sandbox`, CSP y sanitizacion de templates.

## Principios SOLID aplicados
- `S`: responsabilidades separadas (`AuthService`, `ApiTesterService`, `ScreenController`).
- `O`: podes agregar nuevos servicios sin tocar pantalla base.
- `L`: componentes intercambiables por contrato (ej: reemplazar `AuthApi`).
- `I`: modulos chicos y enfocados.
- `D`: `app.js` depende de servicios, no de detalles de `fetch` o `localStorage`.

## Estructura
```
index.html
styles.css
src/
  app.js
  config.js
  app/
    elements.js
    viewAccess.js
    viewManager.js
  core/
    httpClient.js
    logger.js
  auth/
    authApi.js
    authService.js
    sessionStore.js
  be/
    apiTesterService.js
    landingCatalogService.js
    landingPreviewService.js
    componentCatalogService.js
    componentPreviewService.js
    preview/
      previewAssetPolicy.js
      previewEngine.js
      previewTemplateSanitizer.js
  use-cases/
    auth/
    apiTester/
    landings/
    components/
    preview/
    shared/
  features/
    auth/
      authFeature.js
    apiTester/
      apiTesterFeature.js
    landings/
      landingsFeature.js
    components/
      componentsFeature.js
    preview/
      landingPreviewFeature.js
  ui/
    controllers/
      appShellScreenController.js
      landingsScreenController.js
      componentsScreenController.js
      previewScreenController.js
    shared/
      renderUtils.js
    screenController.js
```

## Configuracion
Editar `src/config.js`:
- `DEV_LOGS` para habilitar trazas por consola en desarrollo
- `AUTH_API_BASE` (default `http://localhost:3030/api`)
- `BE_API_BASE` (default `http://localhost:8000/api`)
- `PREVIEW_ASSETS_BASE` para assets locales del preview
- `PREVIEW_ALLOWED_ORIGINS` para whitelistear origenes absolutos permitidos en templates/CSS

## Ejecucion
Servir la carpeta con cualquier servidor estatico.

Ejemplo con Python:
```bash
python -m http.server 5500
```

Luego abrir:
- `http://localhost:5500`

## Notas de arquitectura
- `src/app.js` ahora es bootstrap/composition root.
- Cada vista principal tiene su modulo propio en `src/features/`.
- Los `service` del FE ahora son fachadas finas; la logica de negocio vive en `src/use-cases/`.
- `src/ui/screenController.js` ahora es una fachada sobre controladores de UI mas chicos en `src/ui/controllers/`.
- `src/core/logger.js` centraliza trazas de desarrollo y se controla con `DEV_LOGS`.
- La sesion nueva vive en `sessionStorage`; si existia una sesion vieja en `localStorage`, se migra y limpia.
- Los previews usan templates sanitizados y iframes sandboxeados para reducir riesgo de XSS/escape.
- `LandingPreviewService` y `ComponentPreviewService` comparten motor comun en `src/be/preview/previewEngine.js`.
"# proodos-FE" 
