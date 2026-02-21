namespace CuidAR.Models
{
    public class SolicitudTraslado
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string NombreFamiliar { get; set; } = string.Empty;
        public string Origen { get; set; } = string.Empty;
        public string Destino { get; set; } = string.Empty;
        public DateTime FechaHora { get; set; }
        public DateTime FechaEnvio { get; set; }
    }
}
