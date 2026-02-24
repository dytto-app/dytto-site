import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// Revalidate every 6 hours for llms.txt
export const revalidate = 21600;

interface BlogPost {
  title: string;
  slug: string;
  excerpt?: string;
  published_at: string;
}

export async function GET() {
  // Fetch latest blog posts for GEO content
  let posts: BlogPost[] = [];
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('blog_posts')
      .select('title, slug, excerpt, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(10);

    posts = data || [];
  } catch (err) {
    console.error('llms.txt: failed to fetch posts', err);
  }

  // Format blog posts for llms.txt
  const blogArticlesSection =
    posts.length > 0
      ? posts
          .map((post) => {
            const excerpt = post.excerpt ? `: ${post.excerpt}` : '';
            return `- [${post.title}](https://dytto.app/blog/${post.slug})${excerpt}`;
          })
          .join('\n')
      : '- No posts yet — check back soon';

  const content = `# Dytto

> Dytto is a personal context API for AI agents — the infrastructure layer that lets any AI application know who the user is, in real time.

## What is Dytto?

Dytto is often described as "Plaid for personal context." It passively collects signals from the user's phone (location, calendar, health, habits, photos) and synthesizes them into a queryable context bedrock. AI agents call the Dytto API and get a structured snapshot of "who this user is" — without asking the user a single question.

Dytto solves the cold-start problem for AI personalization. Instead of every app running its own onboarding questionnaire, Dytto maintains a living, evolving understanding of each user. This context is then available to any authorized AI application through a simple REST API.

## Key Features

- Personal context API for AI agents
- Real-time user context from ambient phone data (location, calendar, health, habits)
- Semantic search over user history
- Multi-agent context sharing with scoped permissions
- Privacy-first design: users control exactly what each agent can access
- Plaid-style consent flow: users approve each agent's data access request

## API Overview

Dytto offers several API families:

- **Observe API**: Push unstructured observations, automatically extract and store facts
- **Context API**: Get scoped, task-relevant context for any AI agent
- **Facts API**: Query structured facts with semantic search
- **Agent API**: Full context, stories, events, notifications, relationships, and places
- **Keys API**: Create and manage scoped API keys for third-party agents

## For Developers

- API Reference: https://dytto.app/api-docs
- Documentation: https://dytto.app/docs
- Blog: https://dytto.app/blog
- Waitlist: https://dytto.app/waitlist

## Blog Articles

${blogArticlesSection}

## Technical Details

- Base API URL: https://api.dytto.app
- Authentication: Bearer tokens (OAuth 2.0 / User JWT / Agent Service Key)
- Backend: Supabase (PostgreSQL) + Render (Node.js)
- Mobile: iOS app (Swift / SwiftUI)
- Web: Next.js 14 App Router

## Contact

- Privacy: privacy@dytto.app
- Founded: 2026
- Location: Cambridge, MA
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=21600, stale-while-revalidate=3600',
    },
  });
}
