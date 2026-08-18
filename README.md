# community-home [![Security](https://github.com/A-Digital-Cafe/community-home/actions/workflows/security.yml/badge.svg)](https://github.com/A-Digital-Cafe/community-home/actions/workflows/security.yml)

Preset con la app `community-home`: portada de la comunidad ADC — artículos, rutas de aprendizaje
y el panel de administración de contenido.

## Contenido

- `apps/community-home/` — App UI federada (host, `isHost: true`) servida en el subdominio
  `community`. Expone `./platformLinkResolver` por Module Federation.

## Dependencias

- `content-service` (preset `community-content`) — **requerida**: es la fuente de artículos y rutas.
- `SEOService` (preset `SEO`) — opcional: sitemap y metadatos por página.
- `media-ui-library` (preset `adc-media`) — `uiDependency`: renderiza el contenido en Markdown.

Sin `community-content` la app carga pero no tiene qué mostrar. El preset entero es opcional: si la
carpeta no está, la plataforma arranca igual.
