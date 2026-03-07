import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { create, verify } from "https://deno.land/x/djwt@v2.8/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const JWT_SECRET = Deno.env.get("JWT_SECRET")!;

async function getKey() {
  return await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const url = new URL(req.url);
  const path = url.pathname.split("/").pop();

  try {
    // Login
    if (req.method === "POST" && path === "login") {
      const body = await req.json();
      const { data, error } = await supabase
        .from("Admins")
        .select("*")
        .eq("Email", body.email)
        .single();

      if (error || !data) {
        return new Response(JSON.stringify({ error: "Credenciales inválidas" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const valid = await bcrypt.compare(body.password, data.PasswordHash);
      if (!valid) {
        return new Response(JSON.stringify({ error: "Credenciales inválidas" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const key = await getKey();
      const token = await create(
        { alg: "HS256", typ: "JWT" },
        { email: data.Email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8 },
        key
      );

      return new Response(JSON.stringify({ token }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Verificar token para rutas protegidas
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const key = await getKey();
    await verify(token, key);

    // Rutas protegidas
    if (req.method === "GET" && path === "cuidadores") {
      const { data } = await supabase
        .from("RegistrosCuidador")
        .select("*")
        .order("FechaEnvio", { ascending: false });
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (req.method === "GET" && path === "transportistas") {
      const { data } = await supabase
        .from("RegistrosTransportista")
        .select("*")
        .order("FechaEnvio", { ascending: false });
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (req.method === "GET" && path === "solicitudes-cuidado") {
      const { data } = await supabase
        .from("SolicitudesCuidado")
        .select("*")
        .order("FechaEnvio", { ascending: false });
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (req.method === "GET" && path === "solicitudes-traslado") {
      const { data } = await supabase
        .from("SolicitudesTraslado")
        .select("*")
        .order("FechaEnvio", { ascending: false });
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "Ruta no encontrada" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});