import { getCollection, type CollectionEntry } from 'astro:content';
import type { Language } from '../i18n/ui';

export type LocalizedPost = {
  en: CollectionEntry<'blog'>;
  es: CollectionEntry<'blog'>;
};

export async function getLocalizedPosts(): Promise<LocalizedPost[]> {
  const posts = await getCollection('blog');
  const bySlug = new Map<string, Partial<LocalizedPost>>();

  for (const post of posts) {
    const [lang, ...slugParts] = post.id.split('/');
    if (lang !== 'en' && lang !== 'es') {
      throw new Error(`Unexpected language folder in blog post: ${post.id}`);
    }
    const slug = slugParts.join('/');
    const entry = bySlug.get(slug) || {};
    entry[lang] = post;
    bySlug.set(slug, entry);
  }

  const localized: LocalizedPost[] = [];
  for (const [slug, entry] of bySlug) {
    if (!entry.en || !entry.es) {
      throw new Error(`Missing translation for blog post "${slug}". Every post must have both en/ and es/ versions.`);
    }
    localized.push({ en: entry.en, es: entry.es } as LocalizedPost);
  }

  return localized.sort((a, b) => b.en.data.pubDate.getTime() - a.en.data.pubDate.getTime());
}

export function getPostByLanguage(localized: LocalizedPost, lang: Language): CollectionEntry<'blog'> {
  return localized[lang];
}
