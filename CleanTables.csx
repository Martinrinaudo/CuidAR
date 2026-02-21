using Npgsql;

var connectionString = "Host=db.cvakzhgrnarlcvixhqzx.supabase.co;Database=postgres;Username=postgres;Password=Emilia3513600341.;Port=5432;SSL Mode=Prefer;Trust Server Certificate=true";

Console.WriteLine("???  Limpiando base de datos...");

try
{
    using var conn = new NpgsqlConnection(connectionString);
    conn.Open();

    var sql = @"
        DROP TABLE IF EXISTS ""Postulaciones"" CASCADE;
        DROP TABLE IF EXISTS ""SolicitudesCuidado"" CASCADE;
        DROP TABLE IF EXISTS ""SolicitudesTraslado"" CASCADE;
        DROP TABLE IF EXISTS ""Cuidadores"" CASCADE;
        DROP TABLE IF EXISTS ""Usuarios"" CASCADE;
        DROP TABLE IF EXISTS ""__EFMigrationsHistory"" CASCADE;
    ";

    using var cmd = new NpgsqlCommand(sql, conn);
    cmd.ExecuteNonQuery();

    Console.WriteLine("? Tablas antiguas eliminadas");
}
catch (Exception ex)
{
    Console.WriteLine($"? Error: {ex.Message}");
}
