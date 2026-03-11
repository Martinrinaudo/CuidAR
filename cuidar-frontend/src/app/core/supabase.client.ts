import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://cvakzhgrnarlcvixhqzx.supabase.co',
  'sb_publishable_qBiD19abPu2DT0jNeK9ilA_1xXcBeUX',
  {
    auth: {
      detectSessionInUrl: true,
      flowType: 'implicit',
      persistSession: true
    }
  }
);
