import rss from '@astrojs/rss';
import { getLocalizedPosts } from '../utils/content';

export async function GET(context) {
  const posts = await getLocalizedPosts();
  return rss({
    title: 'Emmanuel Guerra | Blog',
    description: 'Articles about software engineering, mobile development, backend, AI, and more.',
    site: context.site,
    items: posts.map((post) => {
      const slug = post.en.id.replace(/^en\//, '').replace(/\.md$/, '');
      return {
        title: post.en.data.title,
        pubDate: post.en.data.pubDate,
        description: post.en.data.description,
        link: `/blog/${slug}/`,
      };
    }),
    customData: `<language>en-us</language>`,
  });
}
