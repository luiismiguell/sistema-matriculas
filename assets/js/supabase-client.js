const SUPABASE_URL = "https://qasgzavnykkssjasbcgh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_XlsraJuSabfxuCgcFNEB9A_NnsjT36l";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);