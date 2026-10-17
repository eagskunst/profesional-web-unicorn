## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

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