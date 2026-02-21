namespace CuidAR.Models
{
    public class RegistroTransportista
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string ZonaCobertura { get; set; } = string.Empty;
        public string TipoVehiculo { get; set; } = string.Empty;
        public DateTime FechaEnvio { get; set; }
    }
}
