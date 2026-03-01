using CuidAR.Data;
using CuidAR.DTO;
using CuidAR.Models;
using Microsoft.AspNetCore.Mvc;

namespace CuidAR.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FormulariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FormulariosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("cuidador")]
        public async Task<IActionResult> RegistrarCuidador([FromBody] RegistroCuidadorDTO dto)
        {
            var registro = new RegistroCuidador
            {
                Nombre = dto.Nombre,
                Email = dto.Email,
                Telefono = dto.Telefono,
                Experiencia = dto.Experiencia,
                ZonaCobertura = dto.ZonaCobertura,
                Vehiculo = dto.Vehiculo,
                Referencias = dto.Referencias,
                Horario = dto.Horario,
                Dias = dto.Dias,
                FechaEnvio = DateTime.UtcNow
            };

            _context.RegistrosCuidadores.Add(registro);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registro de cuidador enviado exitosamente", id = registro.Id });
        }

        [HttpPost("transportista")]
        public async Task<IActionResult> RegistrarTransportista([FromBody] RegistroTransportistaDTO dto)
        {
            var registro = new RegistroTransportista
            {
                Nombre = dto.Nombre,
                Email = dto.Email,
                Telefono = dto.Telefono,
                ZonaCobertura = dto.ZonaCobertura,
                TipoVehiculo = dto.TipoVehiculo,
                AceptaSillaDeRuedas = dto.AceptaSillaDeRuedas,
                AceptaPagoParticular = dto.AceptaPagoParticular,
                FechaEnvio = DateTime.UtcNow
            };

            _context.RegistrosTransportistas.Add(registro);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registro de transportista enviado exitosamente", id = registro.Id });
        }

        [HttpPost("solicitud-cuidado")]
        public async Task<IActionResult> SolicitarCuidado([FromBody] SolicitudCuidadoDTO dto)
        {
            var solicitud = new SolicitudCuidado
            {
                Nombre = dto.Nombre,
                Email = dto.Email,
                Telefono = dto.Telefono,
                NombreFamiliar = dto.NombreFamiliar,
                Descripcion = dto.Descripcion,
                Zona = dto.Zona,
                FechaEnvio = DateTime.UtcNow
            };

            _context.SolicitudesCuidado.Add(solicitud);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Solicitud de cuidado enviada exitosamente", id = solicitud.Id });
        }

        [HttpPost("solicitud-traslado")]
        public async Task<IActionResult> SolicitarTraslado([FromBody] SolicitudTrasladoDTO dto)
        {
            var solicitud = new SolicitudTraslado
            {
                Nombre = dto.Nombre,
                Email = dto.Email,
                Telefono = dto.Telefono,
                NombreFamiliar = dto.NombreFamiliar,
                Origen = dto.Origen,
                Destino = dto.Destino,
                FechaHora = dto.FechaHora.ToUniversalTime(),
                FechaEnvio = DateTime.UtcNow
            };

            _context.SolicitudesTraslado.Add(solicitud);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Solicitud de traslado enviada exitosamente", id = solicitud.Id });
        }
    }
}
