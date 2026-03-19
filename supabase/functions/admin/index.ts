import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function parseEnvList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const ALLOWED_ORIGINS = parseEnvList(Deno.env.get("ALLOWED_ORIGINS"));
const ADMIN_EMAILS = parseEnvList(Deno.env.get("ADMIN_EMAILS"));

function getCorsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    Vary: "Origin",
  };
}

function getAllowedOrigin(req: Request): string | null {
  const origin = req.headers.get("Origin") ?? "";
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return null;
  }

  return origin;
}

serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(
      JSON.stringify({ error: "Configuración inválida: SUPABASE_URL o SUPABASE_ANON_KEY no definido" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  if (ALLOWED_ORIGINS.length === 0) {
    return new Response(
      JSON.stringify({ error: "Configuración inválida: ALLOWED_ORIGINS no definido" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  if (ADMIN_EMAILS.length === 0) {
    return new Response(
      JSON.stringify({ error: "Configuración inválida: ADMIN_EMAILS no definido" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const allowedOrigin = getAllowedOrigin(req);

  if (!allowedOrigin) {
    return new Response(JSON.stringify({ error: "Origen no permitido" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const corsHeaders = getCorsHeaders(allowedOrigin);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const url = new URL(req.url);
  const path = url.pathname.split("/").pop();

  try {
    if (req.method === "GET" && (path === "health" || path === "admin")) {
      return new Response(
        JSON.stringify({ ok: true, service: "admin", timestamp: new Date().toISOString() }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verificar token de Supabase
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verificar que el email esté en la lista de admins permitidos
    if (!ADMIN_EMAILS.includes(user.email ?? "")) {
      return new Response(JSON.stringify({ error: "Acceso denegado" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Ejecuta consultas como el usuario autenticado para respetar políticas RLS.
    const supabaseAsUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    if (req.method === "GET" && path === "cuidadores") {
      const { data, error } = await supabaseAsUser
        .from("RegistrosCuidadores")
        .select("*")
        .order("FechaEnvio", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "GET" && path === "transportistas") {
      const { data, error } = await supabaseAsUser
        .from("RegistrosTransportistas")
        .select("*")
        .order("FechaEnvio", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "GET" && path === "solicitudes-cuidado") {
      const { data, error } = await supabaseAsUser
        .from("SolicitudesCuidado")
        .select("*")
        .order("FechaEnvio", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "GET" && path === "solicitudes-traslado") {
      const { data, error } = await supabaseAsUser
        .from("SolicitudesTraslado")
        .select("*")
        .order("FechaEnvio", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "GET" && path === "empleadas-domesticas") {
      const { data, error } = await supabaseAsUser
        .from("RegistrosEmpleadasDomesticas")
        .select("*")
        .order("FechaEnvio", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "GET" && path === "solicitudes-empleada-domestica") {
      const { data, error } = await supabaseAsUser
        .from("SolicitudesEmpleadaDomestica")
        .select("*")
        .order("FechaEnvio", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Ruta no encontrada" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});