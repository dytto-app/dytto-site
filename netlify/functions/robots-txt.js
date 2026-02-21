// Netlify serverless function to serve robots.txt with correct Content-Type
// Lambda-based (Node.js) — more reliable than edge functions for static content

const ROBOTS_TXT = `# Dytto - AI Journaling App
# https://dytto.app

User-agent: *
Allow: /

# Sitemap
Sitemap: https://dytto.app/sitemap.xml

# Crawl-delay for polite crawling
Crawl-delay: 1
`;

exports.handler = async () => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  },
  body: ROBOTS_TXT,
});
