// Netlify Edge Function to serve robots.txt directly
// This bypasses all redirect processing issues

const ROBOTS_TXT = `# Dytto - AI Journaling App
# https://dytto.app

User-agent: *
Allow: /

# Sitemap
Sitemap: https://dytto.app/sitemap.xml

# Crawl-delay for polite crawling
Crawl-delay: 1
`;

export default async () => {
  return new Response(ROBOTS_TXT, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

export const config = { path: '/robots.txt' };
