using Microsoft.Extensions.DependencyInjection;
using Mikhtav.Core.Abstractions;
using Mikhtav.Core.Content;
using Mikhtav.Infrastructure;
using Xunit;

namespace Mikhtav.Tests;

public class DependencyInjectionTests
{
    [Fact]
    public void Api_registration_uses_one_editorial_projection_across_request_scopes()
    {
        var services = new ServiceCollection();
        // Editorial content must resolve without creating a database or reading connection settings.
        services.AddInfrastructure(null!);
        using var provider = services.BuildServiceProvider();
        using var first = provider.CreateScope();
        using var second = provider.CreateScope();

        var editorial = first.ServiceProvider.GetRequiredService<IEditorialCatalog>();
        Assert.IsType<EditorialCatalog>(editorial);
        Assert.Same(editorial, second.ServiceProvider.GetRequiredService<IEditorialCatalog>());
    }
}
