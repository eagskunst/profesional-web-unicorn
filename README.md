# profesional-web-unicorn

My personal website and blog, built with [Astro](https://astro.build).

- **Homepage**: portfolio with the original design preserved.
- **Blog**: Markdown posts published in both English and Spanish.
- **SEO**: canonical URLs, OpenGraph/Twitter Cards, `hreflang` alternates, Schema.org JSON-LD, auto-generated sitemap, and RSS feeds.
- **Deployment**: static build hosted on GitHub Pages at `eagskunst.com`.

## Development

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build the production site
npm run build

# Preview the production build locally
npm run preview
```

## Writing a bilingual blog post

1. Create the English version at `src/content/blog/en/<slug>.md`.
2. Create the Spanish version at `src/content/blog/es/<slug>.md`.
3. Use the same file name (slug) in both folders.
4. Add the required frontmatter to both files:

```yaml
---
title: "Post title"
description: "A short description for SEO and previews."
pubDate: 2026-08-29
author: "Emmanuel Guerra"
tags: ["astro", "web development"]
image: "/self_photo_new.png"  # optional, defaults to the portrait
---
```

The build will fail if a post is missing its translation, keeping every article bilingual.

## URL structure

- English (default locale): `/` and `/blog/<slug>/`
- Spanish: `/es/` and `/es/blog/<slug>/`
