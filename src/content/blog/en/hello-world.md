---
title: "Hello, World: Why I Rebuilt My Site with Astro"
description: "A quick look at the migration from a static HTML page to an Astro-powered bilingual blog, and why it matters for SEO and performance."
pubDate: 2026-08-29
author: "Emmanuel Guerra"
tags: ["astro", "web development", "seo"]
---

For years my personal site was a single static HTML file. It was fast, simple, and easy to host, but adding new content meant editing markup by hand. When I decided to start writing regularly, I wanted a setup that kept the performance benefits while making publishing in both English and Spanish painless.

## Why Astro?

Astro ships **zero JavaScript by default**. Every page is rendered to static HTML at build time, which means search engines see the content immediately and Core Web Vitals stay excellent. At the same time, I can still use client-side islands for interactive pieces like the hero animation on the homepage.

## Bilingual content with content collections

Astro's content collections let me define a strict Zod schema for frontmatter. Each post lives in both `src/content/blog/en/` and `src/content/blog/es/`, and the build fails if a translation is missing. This keeps the two language versions in sync and forces me to publish complete posts.

## SEO out of the box

The migration adds:

- Canonical URLs on every page
- Open Graph and Twitter Card meta tags
- `hreflang` alternates for English and Spanish
- Auto-generated `sitemap-index.xml` and RSS feeds
- Schema.org `BlogPosting` JSON-LD on posts

All of this is produced automatically at build time and pushed to GitHub Pages on every commit.

## What's next

I'll be writing about mobile development, backend engineering, AI integrations, and the tooling that makes building software more fun. Stay tuned.
