// Email service integration options

// Option 1: ConvertKit (Recommended for waitlists)
export const submitToConvertKit = async (email: string) => {
  const CONVERTKIT_FORM_ID = 'YOUR_FORM_ID'; // Get from ConvertKit
  const CONVERTKIT_API_KEY = 'YOUR_API_KEY'; // Get from ConvertKit
  
  try {
    const response = await fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: CONVERTKIT_API_KEY,
        email: email,
        tags: ['waitlist', 'dytto-app']
      })
    });
    
    if (!response.ok) throw new Error('Failed to subscribe');
    return await response.json();
  } catch (error) {
    console.error('ConvertKit error:', error);
    throw error;
  }
};

// Option 2: Mailchimp
export const submitToMailchimp = async (email: string) => {
  const MAILCHIMP_API_KEY = 'YOUR_API_KEY';
  const MAILCHIMP_LIST_ID = 'YOUR_LIST_ID';
  const MAILCHIMP_SERVER = 'us1'; // Your server prefix
  
  try {
    const response = await fetch(`https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        tags: ['waitlist', 'dytto-app']
      })
    });
    
    if (!response.ok) throw new Error('Failed to subscribe');
    return await response.json();
  } catch (error) {
    console.error('Mailchimp error:', error);
    throw error;
  }
};

// Option 3: Simple form submission to your own backend
export const submitToBackend = async (email: string) => {
  try {
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        timestamp: new Date().toISOString(),
        source: 'waitlist-landing'
      })
    });
    
    if (!response.ok) throw new Error('Failed to submit');
    return await response.json();
  } catch (error) {
    console.error('Backend error:', error);
    throw error;
  }
};

// Option 4: Supabase (if you want to use a database)
export const submitToSupabase = async (email: string) => {
  const SUPABASE_URL = 'YOUR_SUPABASE_URL';
  const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        email: email,
        created_at: new Date().toISOString(),
        source: 'waitlist-landing'
      })
    });
    
    if (!response.ok) throw new Error('Failed to submit');
    return response;
  } catch (error) {
    console.error('Supabase error:', error);
    throw error;
  }
};