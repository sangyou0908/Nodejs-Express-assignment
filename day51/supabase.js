import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error(".env의 SUPABASE_URL과 SUPABASE_SECRET_KEY를 확인해 주세요.");
}

export const supabase = createClient(supabaseUrl, supabaseSecretKey);
