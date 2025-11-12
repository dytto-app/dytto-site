import { createClient } from 'npm:@supabase/supabase-js@2';
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

interface FeedbackSubmission {
  title: string;
  body?: string;
  category: 'bug' | 'idea' | 'ux';
}

// Rate limiting store (in-memory for simplicity)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function generateVoterHash(ip: string, userAgent: string): Promise<string> {
  const data = new TextEncoder().encode(ip + userAgent + 'dytto-feedback-salt');
  return crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  });
}

function checkRateLimit(identifier: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(identifier);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
}

function validateFeedback(data: any): FeedbackSubmission | null {
  if (!data.title || typeof data.title !== 'string') return null;
  if (data.title.length < 3 || data.title.length > 200) return null;
  if (data.body && (typeof data.body !== 'string' || data.body.length > 1000)) return null;
  if (!['bug', 'idea', 'ux'].includes(data.category)) return null;

  return {
    title: data.title.trim(),
    body: data.body?.trim(),
    category: data.category
  };
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const voterHash = await generateVoterHash(clientIP, userAgent);

    // GET /feedback - Get top feedback
    if (req.method === 'GET' && url.pathname === '/feedback') {
      const limit = parseInt(url.searchParams.get('limit') || '20');

      // Fetch feedback directly from the 'feedback' table.
      // Previously, this used an RPC function 'get_top_feedback'.
      // Now, it directly queries the table, filters out 'closed' status,
      // and orders by 'upvotes' (descending) and 'created_at' (descending).
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .neq('status', 'closed')
        .order('upvotes', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(Math.min(limit, 100));

      if (error) {
        console.error('Error fetching feedback:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch feedback' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Add user vote status to each feedback item.
      // Previously, this used an RPC function 'has_user_voted'.
      // Now, it directly queries the 'votes' table to see if a record exists
      // for the current feedback item and voter hash.
      const feedbackWithVoteStatus = await Promise.all(
        data.map(async (item: any) => {
          const { data: votes } = await supabase
            .from('votes')
            .select('id')
            .eq('feedback_id', item.id)
            .eq('voter_hash', voterHash)
            .limit(1);

          return { ...item, user_has_voted: (votes && votes.length > 0) || false };
        })
      );

      return new Response(
        JSON.stringify({ data: feedbackWithVoteStatus }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /feedback - Submit new feedback
    if (req.method === 'POST' && url.pathname === '/feedback') {
      // Rate limiting
      if (!checkRateLimit(`submit_${voterHash}`, 3, 300000)) { // 3 submissions per 5 minutes
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please wait before submitting again.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const body = await req.json();
      const validatedData = validateFeedback(body);

      if (!validatedData) {
        return new Response(
          JSON.stringify({ error: 'Invalid feedback data' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Insert feedback
      const { data, error } = await supabase
        .from('feedback')
        .insert(validatedData)
        .select()
        .single();

      if (error) {
        console.error('Error creating feedback:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to create feedback' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Add initial vote from submitter
      await supabase
        .from('votes')
        .insert({ feedback_id: data.id, voter_hash: voterHash });

      return new Response(
        JSON.stringify({ data: { ...data, user_has_voted: true } }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /feedback/:id/vote - Vote on feedback
    if (req.method === 'POST' && url.pathname.match(/^\/feedback\/[^\/]+\/vote$/)) {
      const feedbackId = url.pathname.split('/')[2];

      // Rate limiting
      if (!checkRateLimit(`vote_${voterHash}`, 10, 60000)) { // 10 votes per minute
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please wait before voting again.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if feedback exists
      const { data: feedback, error: feedbackError } = await supabase
        .from('feedback')
        .select('id')
        .eq('id', feedbackId)
        .single();

      if (feedbackError || !feedback) {
        return new Response(
          JSON.stringify({ error: 'Feedback not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Try to insert vote (will fail if already voted due to unique constraint)
      const { error: voteError } = await supabase
        .from('votes')
        .insert({ feedback_id: feedbackId, voter_hash: voterHash });

      if (voteError) {
        if (voteError.code === '23505') { // Unique constraint violation
          return new Response(
            JSON.stringify({ error: 'You have already voted on this feedback' }),
            { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.error('Error creating vote:', voteError);
        return new Response(
          JSON.stringify({ error: 'Failed to record vote' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get updated feedback with new vote count
      const { data: updatedFeedback } = await supabase
        .from('feedback')
        .select('*')
        .eq('id', feedbackId)
        .single();

      return new Response(
        JSON.stringify({
          data: { ...updatedFeedback, user_has_voted: true },
          message: 'Vote recorded successfully'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 404 for unknown routes
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
