import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client only if environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create client only if configured, otherwise null
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface WaitlistEntry {
  id: string;
  email: string;
  position: number;
  source: string;
  referral_code: string;
  referred_by?: string;
  referral_count: number;
  status: 'pending' | 'invited' | 'converted' | 'unsubscribed';
  metadata: Record<string, any>;
  created_at: string;
  invited_at?: string;
  converted_at?: string;
}

export interface WaitlistSignupData {
  email: string;
  source?: string;
  referral_code?: string;
  metadata?: Record<string, any>;
}

export interface WaitlistResponse {
  success: boolean;
  data?: WaitlistEntry;
  error?: string;
  position?: number;
}

// Join the waitlist
export const joinWaitlist = async (signupData: WaitlistSignupData): Promise<WaitlistResponse> => {
  // If Supabase is not configured, return a mock success response
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase not configured. Waitlist signup would normally be processed here.');
    
    // Simulate a successful signup for development
    const mockPosition = Math.floor(Math.random() * 1000) + 1;
    
    return {
      success: true,
      data: {
        id: 'mock-id',
        email: signupData.email,
        position: mockPosition,
        source: signupData.source || 'website',
        referral_code: 'MOCK123',
        referral_count: 0,
        status: 'pending',
        metadata: signupData.metadata || {},
        created_at: new Date().toISOString(),
      } as WaitlistEntry,
      position: mockPosition,
    };
  }

  try {
    // Check if email already exists
    const { data: existingEntry } = await supabase
      .from('waitlist_entries')
      .select('*')
      .eq('email', signupData.email)
      .single();

    if (existingEntry) {
      return {
        success: true,
        data: existingEntry,
        position: existingEntry.position,
      };
    }

    // Find referrer if referral code provided
    let referred_by = null;
    if (signupData.referral_code) {
      const { data: referrer } = await supabase
        .from('waitlist_entries')
        .select('id')
        .eq('referral_code', signupData.referral_code)
        .single();
      
      if (referrer) {
        referred_by = referrer.id;
      }
    }

    // Insert new waitlist entry
    const { data, error } = await supabase
      .from('waitlist_entries')
      .insert({
        email: signupData.email,
        source: signupData.source || 'website',
        referred_by,
        metadata: signupData.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
      position: data.position,
    };
  } catch (error) {
    console.error('Waitlist signup error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

// Get waitlist entry by email
export const getWaitlistEntry = async (email: string): Promise<WaitlistResponse> => {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      error: 'Supabase not configured',
    };
  }

  try {
    const { data, error } = await supabase
      .from('waitlist_entries')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
      position: data.position,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

// Get waitlist stats (total count, etc.)
export const getWaitlistStats = async () => {
  if (!isSupabaseConfigured || !supabase) {
    return { total: 0 };
  }

  try {
    const { count, error } = await supabase
      .from('waitlist_entries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (error) {
      console.error('Error getting waitlist stats:', error);
      return { total: 0 };
    }

    return { total: count || 0 };
  } catch (error) {
    console.error('Error getting waitlist stats:', error);
    return { total: 0 };
  }
};

// Update waitlist entry status (admin function)
export const updateWaitlistStatus = async (
  id: string, 
  status: WaitlistEntry['status']
): Promise<WaitlistResponse> => {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      error: 'Supabase not configured',
    };
  }

  try {
    const updateData: any = { status };
    
    if (status === 'invited') {
      updateData.invited_at = new Date().toISOString();
    } else if (status === 'converted') {
      updateData.converted_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('waitlist_entries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

// Utility function to check if Supabase is available
export const isSupabaseAvailable = () => isSupabaseConfigured;