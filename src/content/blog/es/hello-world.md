---
title: "Hola, Mundo: Por qué reconstruí mi sitio con Astro"
description: "Un vistazo rápido a la migración de una página HTML estática a un blog bilingüe con Astro, y por qué importa para el SEO y el rendimiento."
pubDate: 2026-08-29
author: "Emmanuel Guerra"
tags: ["astro", "desarrollo web", "seo"]
---

Durante años mi sitio personal fue un solo archivo HTML estático. Era rápido, simple y fácil de alojar, pero agregar nuevo contenido significaba editar marcado a mano. Cuando decidí empezar a escribir con regularidad, quería una configuración que conservara los beneficios de rendimiento mientras hacía sencilla la publicación en inglés y español.

## ¿Por qué Astro?

Astro envía **cero JavaScript por defecto**. Cada página se renderiza a HTML estático en tiempo de compilación, lo que significa que los motores de búsqueda ven el contenido de inmediato y los Core Web Vitals se mantienen excelentes. Al mismo tiempo, todavía puedo usar islas del lado del cliente para piezas interactivas como la animación del hero en la página de inicio.

## Contenido bilingüe con colecciones de contenido

Las colecciones de contenido de Astro me permiten definir un esquema estricto con Zod para el frontmatter. Cada entrada vive tanto en `src/content/blog/en/` como en `src/content/blog/es/`, y la compilación falla si falta una traducción. Esto mantiene sincronizadas las dos versiones de idioma y me obliga a publicar entradas completas.

## SEO de serie

La migración añade:

- URLs canónicas en cada página
- Metaetiquetas de Open Graph y Twitter Cards
- Alternativas `hreflang` para inglés y español
- `sitemap-index.xml` y feeds RSS generados automáticamente
- JSON-LD de Schema.org `BlogPosting` en las entradas

Todo esto se produce automáticamente en tiempo de compilación y se publica en GitHub Pages con cada commit.

## Qué viene después

Estaré escribiendo sobre desarrollo mobile, ingeniería de backend, integraciones de IA y las herramientas que hacen que construir software sea más divertido. Mantente atento.
