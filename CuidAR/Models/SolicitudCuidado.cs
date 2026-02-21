namespace CuidAR.Models
{
    public class SolicitudCuidado
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string NombreFamiliar { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string Zona { get; set; } = string.Empty;
        public DateTime FechaEnvio { get; set; }
    }
}
