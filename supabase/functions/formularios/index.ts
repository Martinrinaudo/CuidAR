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

// Simple email validation
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Simple phone validation (at least 7 digits)
function isValidPhone(phone: string): boolean {
  return /^\+?[\d\s\-().]{7,}$/.test(phone);
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
    if (req.method === "GET" && path === "health") {
      return new Response(
        JSON.stringify({ ok: true, service: "formularios", timestamp: new Date().toISOString() }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "El cuerpo de la solicitud no es JSON válido" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ─── POST /cuidador ───────────────────────────────────────────────────
    if (req.method === "POST" && path === "cuidador") {
      const { nombre, email, telefono, experiencia, zonaCobertura, horario, dias } = body as Record<string, string>;

      if (!nombre?.trim() || !email?.trim() || !telefono?.trim() || !experiencia?.trim() || !zonaCobertura?.trim() || !horario?.trim() || !dias?.trim()) {
        return new Response(
          JSON.stringify({ error: "Todos los campos obligatorios deben completarse" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!isValidEmail(email)) {
        return new Response(
          JSON.stringify({ error: "El email no es válido" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!isValidPhone(telefono)) {
        return new Response(
          JSON.stringify({ error: "El teléfono no es válido" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { error } = await supabase.from("RegistrosCuidadores").insert({
        Nombre: nombre.trim(),
        Email: email.trim().toLowerCase(),
        Telefono: telefono.trim(),
        Experiencia: experiencia.trim(),
        ZonaCobertura: zonaCobertura.trim(),
        Horario: horario.trim(),
        Dias: dias,
        Referencias: (body.referencias as string)?.trim() ?? null,
        Vehiculo: body.vehiculo ?? null,
        FechaEnvio: new Date().toISOString(),
      });
      if (error) throw error;
      return new Response(JSON.stringify({ message: "Cuidador registrado" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── POST /transportista ─────────────────────────────────────────────
    if (req.method === "POST" && path === "transportista") {
      const { nombre, email, telefono, zonaCobertura, tipoVehiculo } = body as Record<string, string>;

      if (!nombre?.trim() || !email?.trim() || !telefono?.trim() || !zonaCobertura?.trim() || !tipoVehiculo?.trim()) {
        return new Response(
          JSON.stringify({ error: "Todos los campos obligatorios deben completarse" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!isValidEmail(email)) {
        return new Response(
          JSON.stringify({ error: "El email no es válido" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!isValidPhone(telefono)) {
        return new Response(
          JSON.stringify({ error: "El teléfono no es válido" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { error } = await supabase.from("RegistrosTransportistas").insert({
        Nombre: nombre.trim(),
        Email: email.trim().toLowerCase(),
        Telefono: telefono.trim(),
        ZonaCobertura: zonaCobertura.trim(),
        TipoVehiculo: tipoVehiculo.trim(),
        AceptaSillaDeRuedas: body.aceptaSillaDeRuedas ?? false,
        AceptaPagoParticular: body.aceptaPagoParticular ?? false,
        FechaEnvio: new Date().toISOString(),
      });
      if (error) throw error;
      return new Response(
        JSON.stringify({ message: "Transportista registrado" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ─── POST /solicitud-cuidado ─────────────────────────────────────────
    if (req.method === "POST" && path === "solicitud-cuidado") {
      const { nombre, email, telefono, nombreFamiliar, descripcion, zona } = body as Record<string, string>;

      if (!nombre?.trim() || !email?.trim() || !telefono?.trim() || !nombreFamiliar?.trim() || !descripcion?.trim() || !zona?.trim()) {
        return new Response(
          JSON.stringify({ error: "Todos los campos obligatorios deben completarse" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!isValidEmail(email)) {
        return new Response(
          JSON.stringify({ error: "El email no es válido" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!isValidPhone(telefono)) {
        return new Response(
          JSON.stringify({ error: "El teléfono no es válido" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { error } = await supabase.from("SolicitudesCuidado").insert({
        Nombre: nombre.trim(),
        Email: email.trim().toLowerCase(),
        Telefono: telefono.trim(),
        NombreFamiliar: nombreFamiliar.trim(),
        Descripcion: descripcion.trim(),
        Zona: zona.trim(),
        FechaEnvio: new Date().toISOString(),
      });
      if (error) throw error;
      return new Response(JSON.stringify({ message: "Solicitud registrada" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── POST /solicitud-traslado ────────────────────────────────────────
    if (req.method === "POST" && path === "solicitud-traslado") {
      const { nombre, email, telefono, nombreFamiliar, origen, destino, fechaHora } = body as Record<string, string>;

      if (!nombre?.trim() || !email?.trim() || !telefono?.trim() || !nombreFamiliar?.trim() || !origen?.trim() || !destino?.trim() || !fechaHora?.trim()) {
        return new Response(
          JSON.stringify({ error: "Todos los campos obligatorios deben completarse" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!isValidEmail(email)) {
        return new Response(
          JSON.stringify({ error: "El email no es válido" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!isValidPhone(telefono)) {
        return new Response(
          JSON.stringify({ error: "El teléfono no es válido" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { error } = await supabase.from("SolicitudesTraslado").insert({
        Nombre: nombre.trim(),
        Email: email.trim().toLowerCase(),
        Telefono: telefono.trim(),
        NombreFamiliar: nombreFamiliar.trim(),
        Origen: origen.trim(),
        Destino: destino.trim(),
        FechaHora: fechaHora,
        FechaEnvio: new Date().toISOString(),
      });
      if (error) throw error;
      return new Response(JSON.stringify({ message: "Solicitud registrada" }), {
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