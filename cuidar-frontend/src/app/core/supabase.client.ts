import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://cvakzhgrnarlcvixhqzx.supabase.co',
  'sb_publishable_oFJObocsinXhow22T99Ocg_lZvTrKeq',
  {
    auth: {
      detectSessionInUrl: true,
      flowType: 'implicit',
      persistSession: true
    }
  }
);
