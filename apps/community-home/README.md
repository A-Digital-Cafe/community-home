# Community Home

Página principal de Abby's Digital Cafe con Learning Paths.

## Configuración MongoDB

Editar `.env`:
```bash
MONGODB_URI=mongodb://localhost:27017/adc-platform
```

Ver `.env.example` para más opciones (Atlas, Docker, etc).

## Estructura
- `src/pages/`: Páginas (HomePage, PathsPage)
- `src/utils/content-api.ts`: Cliente RPC para content-service
- Usa `@ui-library/utils/connect-rpc` para comunicación RPC

## Features
- Página principal con info de la comunidad
- Learning Paths desde MongoDB vía Connect RPC
- Routing con `@ui-library/utils/router`
- Directorio de comunidades amigas (paginado de a 10, orden por potencia o por boost reciente).
  Panel en `/admin/allies`, sólo admin global. El disclaimer y los requisitos van en
  `components/allies/AlliesInfoModal.tsx`: es el aviso legal del listado, no texto decorativo.
