using Mikhtav.Core.Abstractions;
using Mikhtav.Core.Models;
using Mikhtav.Core.Services;
using Xunit;

namespace Mikhtav.Tests;

public class LetterServiceTests
{
    [Fact]
    public async Task GetLetterBySlug_returns_hebrew_label_and_localised_explainer()
    {
        var sut = new LetterService(new InMemoryRepo());

        var detail = await sut.GetLetterBySlugAsync("sample", "ru");

        Assert.NotNull(detail);
        Assert.Equal("דוגמה", detail!.NameHe);
        Assert.Equal("Образец", detail.Name);
        Assert.Single(detail.Sections);
        Assert.Equal("פרטים", detail.Sections[0].LabelHe);
        Assert.Equal("Личные данные.", detail.Sections[0].Explainer);
    }

    [Fact]
    public async Task GetLetterBySlug_falls_back_to_English_when_translation_missing()
    {
        var sut = new LetterService(new InMemoryRepo());

        var detail = await sut.GetLetterBySlugAsync("sample", "uk");

        Assert.NotNull(detail);
        Assert.Equal("Sample", detail!.Name);
        Assert.Equal("Personal details.", detail.Sections[0].Explainer);
    }

    [Fact]
    public async Task GetIndex_groups_letters_by_category_in_orderIndex_order()
    {
        var sut = new LetterService(new InMemoryRepo());

        var index = await sut.GetIndexAsync("en");

        Assert.Single(index);
        Assert.Equal("Sample category", index[0].Name);
        Assert.Single(index[0].Letters);
        Assert.Equal("Sample", index[0].Letters[0].Name);
    }

    private sealed class InMemoryRepo : ILetterRepository
    {
        private readonly LetterCategory _category = new()
        {
            Id = 1, Slug = "sample-category", Issuer = "Sample Authority", OrderIndex = 1,
            NameHe = "קטגוריה לדוגמה", NameEn = "Sample category",
        };

        private readonly LetterType _letter;
        private readonly LetterSection _section;

        public InMemoryRepo()
        {
            _section = new LetterSection
            {
                Id = 1, LetterTypeId = 1, OrderIndex = 1,
                LabelHe = "פרטים",
                ExplainerEn = "Personal details.",
                ExplainerRu = "Личные данные.",
                Severity = Severity.Info,
            };
            _letter = new LetterType
            {
                Id = 1, CategoryId = 1, Slug = "sample", OrderIndex = 1,
                NameHe = "דוגמה", NameEn = "Sample", NameRu = "Образец",
                SummaryEn = "An example.",
                Category = _category,
                Sections = new[] { _section },
            };
            _category.LetterTypes = new[] { _letter };
        }

        public Task<IReadOnlyList<LetterCategory>> GetCategoriesWithLettersAsync(CancellationToken ct = default) =>
            Task.FromResult<IReadOnlyList<LetterCategory>>(new[] { _category });

        public Task<LetterType?> GetLetterBySlugAsync(string slug, CancellationToken ct = default) =>
            Task.FromResult<LetterType?>(slug == _letter.Slug ? _letter : null);

        public Task<IReadOnlyList<BureauTerm>> GetGlossaryAsync(CancellationToken ct = default) =>
            Task.FromResult<IReadOnlyList<BureauTerm>>(Array.Empty<BureauTerm>());
    }
}
