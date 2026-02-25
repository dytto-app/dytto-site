import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'dytto-revalidate-2026';

export async function POST(request: NextRequest) {
  try {
    // Accept secret from JSON body OR query param
    const searchParams = request.nextUrl.searchParams;
    let slug: string | undefined;
    let secret: string | undefined;

    try {
      const body = await request.json();
      slug = body.slug;
      secret = body.secret;
    } catch {
      // No JSON body — fall back to query params
    }
    secret = secret || searchParams.get('secret') || undefined;
    slug = slug || searchParams.get('slug') || undefined;

    if (secret !== REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    // Revalidate specific post if slug provided
    if (slug) {
      revalidatePath(`/blog/${slug}`);
    }

    // Always revalidate blog listing and sitemap
    revalidatePath('/blog');
    revalidatePath('/sitemap.xml');
    revalidatePath('/llms.txt');

    return NextResponse.json({
      revalidated: true,
      slug: slug || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}

// Also support GET for quick health checks
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'POST to this endpoint with { slug, secret } to revalidate blog pages',
  });
}
