import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://fppflllgeiybkxpbrbxm.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'sb_publishable_qsuNjzyqj66LvyArSyuI2Q_m6WGP3gM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('Supabase client initialized');
