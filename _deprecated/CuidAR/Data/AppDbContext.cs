using CuidAR.Models;
using Microsoft.EntityFrameworkCore;

namespace CuidAR.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Admin> Admins { get; set; }
        public DbSet<RegistroCuidador> RegistrosCuidadores { get; set; }
        public DbSet<RegistroTransportista> RegistrosTransportistas { get; set; }
        public DbSet<SolicitudCuidado> SolicitudesCuidado { get; set; }
        public DbSet<SolicitudTraslado> SolicitudesTraslado { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurar todos los DateTime como UTC
            modelBuilder.Entity<RegistroCuidador>()
                .Property(r => r.FechaEnvio)
                .HasConversion(
                    v => v.ToUniversalTime(),
                    v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

            modelBuilder.Entity<RegistroTransportista>()
                .Property(r => r.FechaEnvio)
                .HasConversion(
                    v => v.ToUniversalTime(),
                    v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

            modelBuilder.Entity<SolicitudCuidado>()
                .Property(s => s.FechaEnvio)
                .HasConversion(
                    v => v.ToUniversalTime(),
                    v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

            modelBuilder.Entity<SolicitudTraslado>()
                .Property(s => s.FechaEnvio)
                .HasConversion(
                    v => v.ToUniversalTime(),
                    v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

            modelBuilder.Entity<SolicitudTraslado>()
                .Property(s => s.FechaHora)
                .HasConversion(
                    v => v.ToUniversalTime(),
                    v => DateTime.SpecifyKind(v, DateTimeKind.Utc));
        }
    }
}


