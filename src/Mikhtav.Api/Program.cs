using Microsoft.EntityFrameworkCore;
using Mikhtav.Infrastructure;
using Mikhtav.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddInfrastructure(builder.Configuration);

// Allow the Vite dev server origin during development.
const string SpaCors = "spa";
builder.Services.AddCors(o => o.AddPolicy(SpaCors, p => p
    .WithOrigins("http://localhost:5173")
    .AllowAnyHeader()
    .AllowAnyMethod()));

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
