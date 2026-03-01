using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CuidAR.Migrations
{
    /// <inheritdoc />
    public partial class AgregarCamposNuevos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AceptaPagoParticular",
                table: "RegistrosTransportistas",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "AceptaSillaDeRuedas",
                table: "RegistrosTransportistas",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Dias",
                table: "RegistrosCuidadores",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Horario",
                table: "RegistrosCuidadores",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Referencias",
                table: "RegistrosCuidadores",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AceptaPagoParticular",
                table: "RegistrosTransportistas");

            migrationBuilder.DropColumn(
                name: "AceptaSillaDeRuedas",
                table: "RegistrosTransportistas");

            migrationBuilder.DropColumn(
                name: "Dias",
                table: "RegistrosCuidadores");

            migrationBuilder.DropColumn(
                name: "Horario",
                table: "RegistrosCuidadores");

            migrationBuilder.DropColumn(
                name: "Referencias",
                table: "RegistrosCuidadores");
        }
    }
}
