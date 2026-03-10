import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Lista de emails autorizados para acceder al panel admin
const AUTHORIZED_ADMIN_EMAILS = [
  "martinrinaudo03@gmail.com",
  "beatrizaraya123@gmail.com",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    }
  );

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const url = new URL(req.url);
  const path = url.pathname.split("/").pop();

  try {
    // Verificar autenticación con Supabase
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Token inválido o expirado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Verificar que el email esté en la lista de administradores autorizados
    if (!AUTHORIZED_ADMIN_EMAILS.includes(user.email!)) {
      return new Response(JSON.stringify({ error: "Acceso denegado. No tienes permisos de administrador." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (req.method === "GET" && path === "cuidadores") {
      const { data } = await supabaseAdmin.from("RegistrosCuidador").select("*").order("FechaEnvio", { ascending: false });
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (req.method === "GET" && path === "transportistas") {
      const { data } = await supabaseAdmin.from("RegistrosTransportista").select("*").order("FechaEnvio", { ascending: false });
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (req.method === "GET" && path === "solicitudes-cuidado") {
      const { data } = await supabaseAdmin.from("SolicitudesCuidado").select("*").order("FechaEnvio", { ascending: false });
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (req.method === "GET" && path === "solicitudes-traslado") {
      const { data } = await supabaseAdmin.from("SolicitudesTraslado").select("*").order("FechaEnvio", { ascending: false });
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
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