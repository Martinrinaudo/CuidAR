namespace CuidAR.DTO
{
    public class RegistroTransportistaDTO
    {
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string ZonaCobertura { get; set; } = string.Empty;
        public string TipoVehiculo { get; set; } = string.Empty;
        public bool AceptaSillaDeRuedas { get; set; }
        public bool AceptaPagoParticular { get; set; }
    }
}
