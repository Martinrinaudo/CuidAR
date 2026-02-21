namespace CuidAR.DTO
{
    public class RegistroCuidadorDTO
    {
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Experiencia { get; set; } = string.Empty;
        public string ZonaCobertura { get; set; } = string.Empty;
        public bool Vehiculo { get; set; }
    }
}
