import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qbuhjokiwkfuphboihug.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFidWhqb2tpd2tmdXBoYm9paHVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTMxMzEwMywiZXhwIjoyMDU0ODg5MTAzfQ.gDlgySzFQiawpevZ2RSPpEbnoVVKdDI0_PJ-vFBnOuA';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function test() {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('user_id', '2d9a5829-032a-489d-ae7e-d8e2597b2de3');

    if (error) {
      console.error('Query error:', error);
      return;
    }

    console.log('Success! Data count:', data.length);
    if (data.length > 0) {
      console.log('First story:', JSON.stringify(data[0], null, 2));
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

test();
