# Verde Vivo

Aplicación Angular para registrar plantas y personas en estado vegetativo, con datos almacenados en Cloud Firestore.

## Desarrollo

Inicia el servidor local con:

```bash
npm start
```

Abre `http://localhost:4200/`. Tailwind CSS se carga desde `src/styles.css`.

## Estructura

- `src/app/components`: listado, tabla paginada, formulario y detalle.
- `src/app/layout`: estructura de navegación.
- `src/app/services`: operaciones CRUD para Firestore.
- `src/app/types`: interfaces y tipos de plantas y personas.

Las rutas son `/` (listado), `/nuevo`, `/editar/:id` y `/:id` (detalle). Los parámetros de ruta se enlazan a inputs con `withComponentInputBinding`; el estado se maneja con propiedades normales, sin signals.

## Firebase y seguridad

La configuración web está en `enviroments/environment.ts`. Los documentos se guardan en la colección `vegetales`; cada documento incluye `tipoRegistro: "planta"` o `tipoRegistro: "persona"`. Los registros de personas contienen nombre y apellidos. Los registros antiguos con identificador interno se pueden seguir leyendo y, al guardarlos de nuevo, el campo antiguo se elimina.

Las reglas de Firestore deben permitir las operaciones necesarias para la app. No uses reglas abiertas ni datos médicos reales en una base sin autenticación y controles de acceso adecuados. Los datos personales y los campos de causa y gravedad son información sensible.

## Build y pruebas

```bash
npm run build
npm test -- --watch=false
```
