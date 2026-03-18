# Arquitectura del Frontend Proodos

## Objetivo
Este documento resume como esta organizado el frontend de Proodos despues del refactor de carpetas a una arquitectura hibrida.

La idea principal es separar:

- bootstrap y configuracion global
- shell de aplicacion
- piezas compartidas
- features por dominio
- capas internas por responsabilidad

## 1. Vista general

El FE es una SPA liviana sin framework.

El navegador carga:

1. `index.html`
2. `src/config.js`
3. `src/app.js`

Desde ahi la aplicacion:

- resuelve referencias del DOM
- crea servicios y adaptadores
- registra vistas
- restaura sesion si existe
- habilita navegacion entre pantallas

## 2. Criterio de carpetas

La estructura actual sigue este criterio:

### Raiz de `src/`
Quedan por fuera de las capas:

- `app.js`: composition root
- `config.js`: configuracion global

### `app/`
Contiene shell y navegacion base:

- `elements.js`
- `viewAccess.js`
- `viewManager.js`

No pertenece a una feature puntual. Es la capa de ensamblado de la aplicacion.

### `shared/`
Contiene piezas reutilizables por varias features:

- `shared/infrastructure`
- `shared/application`
- `shared/presentation`

### `features/`
Cada feature agrupa su propio dominio:

- `auth`
- `apiTester`
- `landings`
- `components`
- `preview`
- `navigation`

Dentro de cada feature puede haber:

- `presentation`
- `application`
- `infrastructure`

No todas las features necesitan las tres capas.

## 3. Capas

## 3.1 Presentation
Responsabilidad:

- escuchar eventos de UI
- manejar estado visual
- renderizar DOM
- coordinar la interaccion con el usuario

Ejemplos:

- `features/auth/presentation/authFeature.js`
- `features/components/presentation/componentsFeature.js`
- `features/landings/presentation/landingsFeature.js`
- `features/preview/presentation/landingPreviewFeature.js`
- `shared/presentation/screenController.js`

La presentacion incluye el render.

## 3.2 Application
Responsabilidad:

- modelar flujos de uso
- orquestar llamadas
- validar inputs de negocio
- transformar respuestas

Ejemplos:

- `features/auth/application/authService.js`
- `features/components/application/componentCatalogService.js`
- `features/components/application/componentManagementService.js`
- `features/preview/application/landingPreviewService.js`
- `features/*/application/use-cases/*`

En esta capa viven:

- services como fachada/orquestador
- use cases como logica puntual

## 3.3 Infrastructure
Responsabilidad:

- resolver detalles tecnicos
- acceso HTTP
- persistencia local
- motor de preview

Ejemplos:

- `shared/infrastructure/httpClient.js`
- `shared/infrastructure/logger.js`
- `features/auth/infrastructure/authApi.js`
- `features/auth/infrastructure/sessionStore.js`
- `features/preview/infrastructure/previewEngine.js`

## 4. Arbol actual

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
          getValidTokenUseCase.js
          loginUseCase.js
          logoutUseCase.js
          refreshSessionUseCase.js
          restoreSessionUseCase.js
          tokenExpiry.js
      presentation/
        authFeature.js

    apiTester/
      application/
        apiTesterService.js
        use-cases/
          executeApiTesterRequestUseCase.js
      presentation/
        apiTesterFeature.js

    landings/
      application/
        landingCatalogService.js
        use-cases/
          listLandingsUseCase.js
      presentation/
        landingsFeature.js
        landingsScreenController.js

    components/
      application/
        componentCatalogService.js
        componentManagementService.js
        componentPreviewService.js
        use-cases/
          createComponenteUseCase.js
          getComponenteDetailUseCase.js
          listComponentesUseCase.js
          listTiposVariacionUseCase.js
          loadCreateComponenteFormUseCase.js
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
          generateComponentPreviewUseCase.js
          generateLandingPreviewUseCase.js
      presentation/
        landingPreviewFeature.js
        previewScreenController.js

    navigation/
      presentation/
        navigationFeature.js
```

## 5. Flujo de alto nivel

### Arranque
`src/app.js`:

1. lee `window.PROODOS_CONFIG`
2. crea `HttpClient`, `AuthApi`, `SessionStore`, `AuthService`
3. crea services de cada feature
4. crea `ScreenController`
5. crea features de presentacion
6. registra vistas
7. ejecuta `authFeature.init()`

### Login
Flujo:

1. `authFeature` toma credenciales
2. llama `authService.login(...)`
3. `authService` delega al caso de uso
4. `authApi` hace el request a Auth
5. `sessionStore` persiste sesion
6. `screenController` muestra la app

### Navegacion
Flujo:

1. `navigationFeature` detecta `data-view`
2. llama a `viewManager.setView(...)`
3. `viewManager` actualiza `hash` y activa vista
4. si la vista tiene `onEnter`, la ejecuta

### Feature de componentes
Flujo:

1. `componentsFeature` carga catalogo o detalle
2. usa `componentCatalogService` o `componentManagementService`
3. esos services delegan a casos de uso
4. los casos de uso usan `httpClient` y helpers compartidos
5. `componentsScreenController` renderiza listado, detalle o alta

### Preview
Flujo:

1. `landingPreviewFeature` pide generar preview
2. `landingPreviewService` delega al caso de uso
3. el caso de uso usa `previewEngine`
4. `previewEngine` resuelve assets, carga template, sanitiza e hidrata
5. `previewScreenController` inyecta el resultado en `iframe.srcdoc`

## 6. Reglas practicas de esta arquitectura

### `presentation`
Debe:

- manejar eventos
- mostrar estados
- renderizar datos

No debe:

- construir requests HTTP directamente
- duplicar logica de negocio

### `application`
Debe:

- orquestar
- validar inputs funcionales
- decidir el flujo

No debe:

- manipular DOM
- depender de detalles visuales

### `infrastructure`
Debe:

- encapsular detalles tecnicos
- ser reutilizable

No debe:

- tomar decisiones de UI

## 7. Resumen

La estructura actual busca equilibrio entre:

- orden por capa
- orden por feature

No es una clean architecture “pura” como backend, pero conserva un principio importante:

- la UI no habla directo con infraestructura
- los services no dependen del DOM
- los casos de uso concentran la logica
- el bootstrap queda aislado en `app.js`

Eso deja al FE en una posicion buena para seguir creciendo sin volver a un archivo unico o a una estructura desordenada por carpeta tecnica.
