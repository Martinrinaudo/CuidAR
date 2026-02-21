using CuidAR.Data;
using CuidAR.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CuidAR.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AdminController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AdminLoginDTO dto)
        {
            var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == dto.Email);
            
            if (admin == null || !BCrypt.Net.BCrypt.Verify(dto.Password, admin.PasswordHash))
            {
                return Unauthorized(new { message = "Credenciales inválidas" });
            }

            var token = GenerateJwtToken(admin);
            return Ok(new { token });
        }

        [Authorize]
        [HttpGet("cuidadores")]
        public async Task<IActionResult> GetCuidadores()
        {
            var cuidadores = await _context.RegistrosCuidadores
                .OrderByDescending(r => r.FechaEnvio)
                .ToListAsync();
            return Ok(cuidadores);
        }

        [Authorize]
        [HttpGet("transportistas")]
        public async Task<IActionResult> GetTransportistas()
        {
            var transportistas = await _context.RegistrosTransportistas
                .OrderByDescending(r => r.FechaEnvio)
                .ToListAsync();
            return Ok(transportistas);
        }

        [Authorize]
        [HttpGet("solicitudes-cuidado")]
        public async Task<IActionResult> GetSolicitudesCuidado()
        {
            var solicitudes = await _context.SolicitudesCuidado
                .OrderByDescending(s => s.FechaEnvio)
                .ToListAsync();
            return Ok(solicitudes);
        }

        [Authorize]
        [HttpGet("solicitudes-traslado")]
        public async Task<IActionResult> GetSolicitudesTraslado()
        {
            var solicitudes = await _context.SolicitudesTraslado
                .OrderByDescending(s => s.FechaEnvio)
                .ToListAsync();
            return Ok(solicitudes);
        }

        private string GenerateJwtToken(Models.Admin admin)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, admin.Email),
                new Claim(ClaimTypes.NameIdentifier, admin.Id.ToString())
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
