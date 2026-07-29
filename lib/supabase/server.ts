import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error("Supabase URL or Service Role Key is not configured");
    }

    _client = createClient(url, key);
  }
  return _client;
}

export const supabaseAdmin: SupabaseClient = new Proxy(
  {} as SupabaseClient,
  {
    get(_, prop) {
      const c = getClient();
      const v = Reflect.get(c, prop, c);
      if (typeof v === "function") {
        return v.bind(c);
      }
      return v;
    },
  }
);