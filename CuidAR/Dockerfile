FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["CuidAR.csproj", "."]
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV DOTNET_GCHeapHardLimit=400000000
ENV DOTNET_GCConserveMemory=9
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "CuidAR.dll"]
