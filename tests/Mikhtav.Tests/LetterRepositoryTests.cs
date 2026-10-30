using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Mikhtav.Core.Content;
using Mikhtav.Core.Services;
using Mikhtav.Infrastructure.Data;
using Xunit;

namespace Mikhtav.Tests;

public class LetterRepositoryTests
{
    [Theory]
    [InlineData("en")]
    [InlineData("he")]
    [InlineData("ru")]
    [InlineData("uk")]
    public async Task Relational_index_and_detail_agree_on_severity_actions_and_deadlines(string language)
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        var options = new DbContextOptionsBuilder<AppDbContext>().UseSqlite(connection).Options;
        await using var database = new AppDbContext(options);
        await database.Database.EnsureCreatedAsync();
        database.ChangeTracker.Clear();
        var repository = new LetterRepository(database);
        var service = new LetterService(repository, NullLogger<LetterService>.Instance, new EditorialCatalog());

        var categories = await service.GetIndexAsync(language);
        Assert.NotEmpty(categories);
        foreach (var summary in categories.SelectMany(category => category.Letters))
        {
            var detail = await service.GetLetterBySlugAsync(summary.Slug, language);
            Assert.NotNull(detail);
            Assert.NotEmpty(detail!.Sections);
            Assert.Equal(detail.Guidance.OverallSeverity, summary.Severity);
            Assert.Equal(detail.Sections.Any(section => !string.IsNullOrWhiteSpace(section.ActionRequired)), summary.HasActionRequired);
            Assert.Equal(detail.Sections.Any(section => !string.IsNullOrWhiteSpace(section.Deadline)), summary.HasDeadline);
        }
        // Ensure this covers a warning/critical letter rather than only informational examples.
        Assert.Contains(categories.SelectMany(category => category.Letters), letter => letter.Severity == "critical");
        Assert.Empty(database.ChangeTracker.Entries());
    }
}
