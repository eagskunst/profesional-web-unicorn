import rss from '@astrojs/rss';
import { getLocalizedPosts } from '../../utils/content';

export async function GET(context) {
  const posts = await getLocalizedPosts();
  return rss({
    title: 'Emmanuel Guerra | Blog',
    description: 'Artículos sobre ingeniería de software, desarrollo mobile, backend, IA y más.',
    site: context.site,
    items: posts.map((post) => {
      const slug = post.es.id.replace(/^es\//, '').replace(/\.md$/, '');
      return {
        title: post.es.data.title,
        pubDate: post.es.data.pubDate,
        description: post.es.data.description,
        link: `/es/blog/${slug}/`,
      };
    }),
    customData: `<language>es-es</language>`,
  });
}
