using System.Text.Json;
using Microsoft.Extensions.Logging.Abstractions;
using Mikhtav.Core.Abstractions;
using Mikhtav.Core.Models;
using Mikhtav.Core.Services;
using Mikhtav.Infrastructure.Data;

var output = args.Length > 0 ? args[0] : "src/web/public/catalog";
var service = new LetterService(new SeedRepository(), NullLogger<LetterService>.Instance);
foreach (var lang in new[] { "en", "he", "ru", "uk" })
{
    var directory = Path.Combine(output, lang);
    Directory.CreateDirectory(directory);
    async Task Write(string name, object value) => await File.WriteAllTextAsync(
        Path.Combine(directory, name + ".json"),
        JsonSerializer.Serialize(value, new JsonSerializerOptions(JsonSerializerDefaults.Web)));
    await Write("index", await service.GetIndexAsync(lang));
    await Write("glossary", await service.GetGlossaryAsync(lang));
    foreach (var letter in SeedData.LetterTypes)
        await Write(letter.Slug, (await service.GetLetterBySlugAsync(letter.Slug, lang))!);
}
Console.WriteLine($"Exported {SeedData.LetterTypes.Length} letters in four locales to {output}");

sealed class SeedRepository : ILetterRepository
{
    public SeedRepository()
    {
        foreach (var category in SeedData.Categories)
            category.LetterTypes = SeedData.LetterTypes.Where(l => l.CategoryId == category.Id).ToList();
        foreach (var letter in SeedData.LetterTypes)
        {
            letter.Category = SeedData.Categories.Single(c => c.Id == letter.CategoryId);
            letter.Sections = SeedData.Sections.Where(s => s.LetterTypeId == letter.Id).ToList();
        }
    }
    public Task<IReadOnlyList<LetterCategory>> GetCategoriesWithLettersAsync(CancellationToken ct = default)
        => Task.FromResult<IReadOnlyList<LetterCategory>>(SeedData.Categories);
    public Task<LetterType?> GetLetterBySlugAsync(string slug, CancellationToken ct = default)
        => Task.FromResult(SeedData.LetterTypes.FirstOrDefault(l => l.Slug == slug));
    public Task<IReadOnlyList<BureauTerm>> GetGlossaryAsync(CancellationToken ct = default)
        => Task.FromResult<IReadOnlyList<BureauTerm>>(SeedData.Glossary);
}
