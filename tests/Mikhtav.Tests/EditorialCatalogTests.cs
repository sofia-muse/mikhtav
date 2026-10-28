using Mikhtav.Core.Content;
using Mikhtav.Core.Dtos;
using Mikhtav.Infrastructure.Data;
using Xunit;

namespace Mikhtav.Tests;

public class EditorialCatalogTests
{
    [Theory]
    [InlineData("en")]
    [InlineData("he")]
    [InlineData("ru-RU")]
    [InlineData("uk")]
    [InlineData("fr")]
    public void Published_letters_keep_section_identity_and_have_complete_editorial_content(string language)
    {
        foreach (var seed in SeedData.LetterTypes)
        {
            var sections = SeedData.Sections.Where(s => s.LetterTypeId == seed.Id)
                .OrderBy(s => s.OrderIndex).Select(s => new LetterSectionDto(s.OrderIndex,
                    s.LabelHe, s.ExplainerEn, s.ActionRequiredEn, s.Deadline,
                    s.Severity.ToString().ToLowerInvariant())).ToList();
            var guidance = new LetterGuidanceDto("info", "fallback", null, seed.NeedsDocuments,
                null, null, null, null);
            var detail = new LetterDetailDto(seed.Id, seed.Slug, seed.NameEn, seed.NameHe,
                "fallback issuer", "fallback category", seed.SummaryEn, guidance, sections);
            var category = SeedData.Categories.Single(c => c.Id == seed.CategoryId);
            var localized = EditorialCatalog.Localize(detail, category.Slug, language);
            Assert.True(localized.TranslationComplete, $"{seed.Slug}/{language}");
            Assert.Equal(sections.Select(s => (s.Order, s.LabelHe)), localized.Sections.Select(s => (s.Order, s.LabelHe)));
            Assert.NotEqual("fallback", localized.Guidance.PrimaryNextStep);
            Assert.False(string.IsNullOrWhiteSpace(localized.Guidance.WhatToVerify));
            Assert.NotNull(localized.Editorial);
            Assert.NotEmpty(localized.Editorial!.Sources);
            Assert.All(localized.Editorial.Sources, source => Assert.StartsWith("https://", source.Url));
        }
    }

    [Fact]
    public void Missing_category_translation_is_not_marked_complete()
    {
        var detail = new LetterDetailDto(1, "ishur-bituach", "fallback", "אישור", "issuer", "category", "summary",
            new LetterGuidanceDto("info", "fallback", null, false, null, null, null, null),
            SeedData.Sections.Where(s => s.LetterTypeId == 1).Select(s => new LetterSectionDto(
                s.OrderIndex, s.LabelHe, s.ExplainerEn, s.ActionRequiredEn, s.Deadline, "info")).ToList());
        Assert.False(EditorialCatalog.Localize(detail, "untranslated-category", "ru").TranslationComplete);
    }

    [Fact]
    public void Informational_sections_do_not_inherit_outdated_seed_actions_or_deadlines()
    {
        var letter = new LetterDetailDto(1, "ishur-bituach", "fallback", "אישור", "issuer", "category", "summary",
            new LetterGuidanceDto("info", "fallback", "fallback deadline", false, null, null, null, null),
            new[] { new LetterSectionDto(1, "פרטים", "fallback", "unwanted task", "unwanted deadline", "info") });
        var localized = EditorialCatalog.Localize(letter, "bituach-leumi", "en");
        // The first section is informational in the editorial record; null must suppress fallback.
        Assert.Null(localized.Sections[0].Deadline);
        Assert.DoesNotContain(localized.Sections, s => s.ActionRequired == "unwanted task");
    }
}
