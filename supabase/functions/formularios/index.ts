import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
  const body = await req.json();

  try {
    if (req.method === "POST" && path === "cuidador") {
      const { error } = await supabase.from("RegistrosCuidador").insert({
        Nombre: body.nombre,
        Email: body.email,
        Telefono: body.telefono,
        Experiencia: body.experiencia,
        ZonaCobertura: body.zonaCobertura,
        Horario: body.horario,
        Dias: body.dias,
        Referencias: body.referencias,
        Vehiculo: body.vehiculo,
        FechaEnvio: new Date().toISOString()
      });
      if (error) throw error;
      return new Response(JSON.stringify({ message: "Cuidador registrado" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (req.method === "POST" && path === "transportista") {
      const { error } = await supabase.from("RegistrosTransportista").insert({
        Nombre: body.nombre,
        Email: body.email,
        Telefono: body.telefono,
        ZonaCobertura: body.zonaCobertura,
        TipoVehiculo: body.tipoVehiculo,
        AceptaSillaDeRuedas: body.aceptaSillaDeRuedas,
        AceptaPagoParticular: body.aceptaPagoParticular,
        FechaEnvio: new Date().toISOString()
      });
      if (error) throw error;
      return new Response(JSON.stringify({ message: "Transportista registrado" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (req.method === "POST" && path === "solicitud-cuidado") {
      const { error } = await supabase.from("SolicitudesCuidado").insert({
        Nombre: body.nombre,
        Email: body.email,
        Telefono: body.telefono,
        NombreFamiliar: body.nombreFamiliar,
        Descripcion: body.descripcion,
        Zona: body.zona,
        FechaEnvio: new Date().toISOString()
      });
      if (error) throw error;
      return new Response(JSON.stringify({ message: "Solicitud registrada" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (req.method === "POST" && path === "solicitud-traslado") {
      const { error } = await supabase.from("SolicitudesTraslado").insert({
        Nombre: body.nombre,
        Email: body.email,
        Telefono: body.telefono,
        NombreFamiliar: body.nombreFamiliar,
        Origen: body.origen,
        Destino: body.destino,
        FechaHora: body.fechaHora,
        FechaEnvio: new Date().toISOString()
      });
      if (error) throw error;
      return new Response(JSON.stringify({ message: "Solicitud registrada" }), {
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