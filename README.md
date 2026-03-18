# Proodos - FE

Frontend en `HTML + CSS + JavaScript` sin framework.

## Enfoque arquitectonico
El FE usa una arquitectura hibrida:

- `app.js` y `config.js` quedan en la raiz de `src/` como composition root y configuracion global.
- `app/` contiene shell y navegacion base.
- `shared/` contiene piezas transversales reutilizables.
- `features/` organiza la logica por dominio, con capas internas.

Capas principales:

- `presentation`: comportamiento de UI y render.
- `application`: servicios y casos de uso.
- `infrastructure`: integraciones tecnicas y adaptadores.

## Estructura
```text
src/
  app.js
  config.js

  app/
    elements.js
    viewAccess.js
    viewManager.js

  shared/
    application/
      normalizeApiData.js
      requireValidToken.js
    infrastructure/
      httpClient.js
      logger.js
    presentation/
      screenController.js
      ui/
        controllers/
          appShellScreenController.js
        shared/
          renderUtils.js

  features/
    auth/
      infrastructure/
        authApi.js
        sessionStore.js
      application/
        authService.js
        use-cases/
      presentation/
        authFeature.js

    apiTester/
      application/
        apiTesterService.js
        use-cases/
      presentation/
        apiTesterFeature.js

    landings/
      application/
        landingCatalogService.js
        use-cases/
      presentation/
        landingsFeature.js
        landingsScreenController.js

    components/
      application/
        componentCatalogService.js
        componentManagementService.js
        componentPreviewService.js
        use-cases/
      presentation/
        componentsFeature.js
        componentsScreenController.js

    preview/
      infrastructure/
        previewAssetPolicy.js
        previewEngine.js
        previewTemplateSanitizer.js
      application/
        landingPreviewService.js
        use-cases/
      presentation/
        landingPreviewFeature.js
        previewScreenController.js

    navigation/
      presentation/
        navigationFeature.js
```

## Configuracion
Editar `src/config.js`:

- `DEV_LOGS`
- `AUTH_API_BASE`
- `BE_API_BASE`
- `PREVIEW_ASSETS_BASE`
- `PREVIEW_ALLOWED_ORIGINS`

## Ejecucion
Servir la carpeta con cualquier servidor estatico.

Ejemplo:
```bash
python -m http.server 5500
```

Luego abrir:
```text
http://localhost:5500
```

## Notas
- `src/app.js` compone dependencias y arranca la aplicacion.
- `shared/infrastructure` concentra logging y HTTP.
- `shared/presentation/screenController.js` es la fachada global de render.
- `features/*/application` contiene servicios y casos de uso.
- `features/*/presentation` contiene features y controladores de pantalla.
- `features/preview/infrastructure` encapsula el motor tecnico de preview.

## Documentacion adicional
- Ver `ARCHITECTURE.md` para una explicacion mas detallada de la arquitectura y los flujos principales.
- Ver `IMPLEMENTATION_PROMPT.md` para un prompt base reusable al pedir o implementar cambios sobre el FE.
