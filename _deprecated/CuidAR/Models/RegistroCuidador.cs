namespace CuidAR.Models
{
    public class RegistroCuidador
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Experiencia { get; set; } = string.Empty;
        public string ZonaCobertura { get; set; } = string.Empty;
        public bool Vehiculo { get; set; }
        public string Referencias { get; set; } = string.Empty;
        public string Horario { get; set; } = string.Empty;
        public string Dias { get; set; } = string.Empty;
        public DateTime FechaEnvio { get; set; }
    }
}
