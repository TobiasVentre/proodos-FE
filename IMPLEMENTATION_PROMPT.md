# Prompt Base Para Cambios En El FE

Este archivo deja un prompt reusable para pedir o implementar cambios en `Proodos-FE` sin perder de vista la arquitectura actual.

## Como usarlo

Copiar el bloque de abajo y adaptarlo al cambio puntual que se quiera hacer.

## Prompt

```text
Estás trabajando sobre `Proodos-FE`, un frontend sin framework hecho en `HTML + CSS + JavaScript`, con arquitectura híbrida por `feature` y por `capa`.

Objetivo del trabajo:
- [describir acá el cambio puntual]

Antes de proponer cambios, revisá y respetá esta arquitectura:

1. Bootstrap y composition root
- `index.html` carga `src/config.js` y luego `src/app.js`.
- `src/app.js` es el composition root real.
- En `src/app.js` se crean `HttpClient`, `SessionStore`, `AuthApi`, `AuthService`, los services por feature, `ScreenController`, `ViewManager` y las features de presentación.
- También registra las vistas, hace `bind()` de eventos y ejecuta `init()`.

2. Estructura por capas
- `presentation`: escucha eventos, maneja estado visual y renderiza DOM.
- `application`: orquesta flujos y expone services + use cases.
- `infrastructure`: resuelve HTTP, storage, auth API, preview engine y detalles técnicos.

3. Reglas de dependencia
- La UI no debe hacer `fetch` directo.
- `presentation` no debe hablar directo con infraestructura.
- Si un cambio necesita llamar al backend, hacerlo por `service -> use case -> httpClient`.
- Si un cambio necesita token, usar `authService` y/o `shared/application/requireValidToken.js`.
- El render global debe pasar por `ScreenController` y sus subcontroladores.

4. Archivos guía
- Bootstrap: `src/app.js`
- Shell / navegación: `src/app/elements.js`, `src/app/viewManager.js`, `src/app/viewAccess.js`
- Render global: `src/shared/presentation/screenController.js`
- HTTP y logs: `src/shared/infrastructure/httpClient.js`, `src/shared/infrastructure/logger.js`
- Auth: `src/features/auth/**`
- Componentes: `src/features/components/**`
- Preview: `src/features/preview/**`

5. Mapa de llamadas de alto nivel
- Login:
  `authFeature -> authService -> loginUseCase -> authApi -> httpClient`
- Restauración de sesión:
  `authFeature.init -> authService.restoreSession -> restoreSessionUseCase -> getValidTokenUseCase -> refreshSessionUseCase`
- Navegación:
  `navigationFeature -> viewManager.setView -> screen.setActiveView`
- Listado / detalle de componentes:
  `componentsFeature -> componentCatalogService -> use cases -> httpClient`
- Alta / edición de relaciones de componentes:
  `componentsFeature -> componentManagementService -> use cases -> httpClient`
- Preview:
  `landingPreviewFeature/componentPreview flow -> preview services -> preview use cases -> previewEngine`

6. Estado actual del FE
- `src/app.js` centraliza el ensamblado de dependencias.
- `ViewManager` controla el `hash`, la vista activa y los `onEnter`.
- `ScreenController` es la fachada de render.
- `AuthService` centraliza sesión, token, refresh y logout.
- `SessionStore` persiste sesión en `sessionStorage`.
- `HttpClient` es el punto único de requests HTTP y errores.
- `logger` ya redacciona claves sensibles como `password`, `token`, `refreshToken` y `authorization`.

7. Estado actual de la feature de componentes
- `componentsFeature.js` maneja listado, detalle, alta y edición de asignaciones.
- `componentCatalogService.js` resuelve listado y detalle.
- `componentManagementService.js` resuelve alta, carga de catálogos, listado de planes, listado de variaciones y actualización de asignaciones.
- `componentsScreenController.js` renderiza:
  - listado
  - detalle
  - formulario de alta
  - formulario de edición de variación / plan dentro del detalle
- Regla funcional actual:
  - la variación del componente es obligatoria
  - el plan es opcional y puede quedar en `null`

8. Criterio para implementar cambios
- Si el cambio es visual y no altera datos, tocar `presentation` y `ScreenController`.
- Si el cambio agrega una acción nueva de negocio, crear o extender un `use case` en `application`.
- Si el cambio requiere un endpoint nuevo o distinto contrato HTTP, encapsularlo en `application/use-cases` y usar `httpClient`.
- Si el cambio afecta autenticación o sesión, concentrarlo en `features/auth`.
- Si el cambio toca navegación entre pantallas, resolverlo vía `ViewManager`, no manipulando el DOM o el `hash` a mano desde cualquier lado.

9. Reglas de implementación
- Mantener consistencia con el patrón ya existente.
- No duplicar lógica entre `presentation` y `application`.
- No meter lógica de negocio en `ScreenController`.
- No romper el `preview` cuando se toca el detalle de componentes.
- Si hay un formulario nuevo, contemplar:
  - carga inicial
  - estado loading
  - validación mínima
  - mensaje de error
  - recarga del detalle/listado si corresponde

10. Resultado esperado
- Explicá brevemente qué archivos cambian y por qué.
- Implementá el cambio respetando la arquitectura actual.
- Si encontrás una inconsistencia arquitectónica, señalala y proponé el ajuste mínimo.
```

## Recordatorio rapido

- `src/app.js` ensambla.
- `presentation` escucha y renderiza.
- `application` decide y orquesta.
- `infrastructure` ejecuta detalles técnicos.
- `ScreenController` centraliza render.
- `ViewManager` centraliza navegación.
- `AuthService` centraliza sesión y token.
- `componentsFeature` no debería saltear sus services.
