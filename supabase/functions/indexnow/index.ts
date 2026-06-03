import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const HOST = "xinirox.co.in";
const KEY = "8a3f9c1d2e4b5a6f7c8d9e0a1b2c3d4e";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const ENDPOINTS = [
  "https://api.indexnow.org/IndexNow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const inputPaths: string[] = Array.isArray(body?.paths) ? body.paths : [];
    if (!inputPaths.length) {
      return new Response(JSON.stringify({ error: "paths required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const urlList = inputPaths
      .map((p) => (p.startsWith("http") ? p : `https://${HOST}${p.startsWith("/") ? p : `/${p}`}`))
      .slice(0, 10000);

    const payload = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    };

    const results = await Promise.allSettled(
      ENDPOINTS.map((url) =>
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify(payload),
        }).then((r) => ({ endpoint: url, status: r.status }))
      )
    );

    return new Response(
      JSON.stringify({
        submitted: urlList.length,
        results: results.map((r) =>
          r.status === "fulfilled" ? r.value : { endpoint: "?", error: String(r.reason) }
        ),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
