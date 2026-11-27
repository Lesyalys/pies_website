import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error(
        "Не заданы VITE_SUPABASE_URL или VITE_SUPABASE_PUBLISHABLE_KEY в .env"
    );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET = "product";

export const getProductImageUrl = (raw: string) => {
    if (!raw) return "";
    if (/^https?:\/\//.test(raw)) return raw;

    const clean = raw.replace(/^\.\/+/, "").replace(/^\/+/, "");
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(clean);
    return data.publicUrl;
};