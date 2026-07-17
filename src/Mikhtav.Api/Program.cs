using Microsoft.EntityFrameworkCore;
using Mikhtav.Infrastructure;
using Mikhtav.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddInfrastructure(builder.Configuration);

const string SpaCors = "spa";
var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? Array.Empty<string>();
builder.Services.AddCors(o => o.AddPolicy(SpaCors, p =>
{
    if (corsOrigins.Length > 0)
        p.WithOrigins(corsOrigins);
    p.AllowAnyHeader().AllowAnyMethod();
}));

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

if (app.Environment.IsDevelopment())
{
    // Apply EF migrations on startup (dev only). Retries briefly while SQL warms up.
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    for (var attempt = 1; attempt <= 10; attempt++)
    {
        try { db.Database.Migrate(); break; }
        catch when (attempt < 10) { Thread.Sleep(2000); }
    }
}

app.UseCors(SpaCors);
app.MapControllers();

app.Run();
