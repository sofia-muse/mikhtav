using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Mikhtav.Core.Abstractions;
using Mikhtav.Core.Services;
using Mikhtav.Infrastructure.Data;

namespace Mikhtav.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(config.GetConnectionString("Default")));

        services.AddScoped<ILetterRepository, LetterRepository>();
        services.AddScoped<ILetterService, LetterService>();

        return services;
    }
}
