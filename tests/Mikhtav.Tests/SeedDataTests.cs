using Mikhtav.Infrastructure.Data;
using Xunit;

namespace Mikhtav.Tests;

public class SeedDataTests
{
    [Fact]
    public void Categories_and_letters_have_unique_slugs_and_valid_relationships()
    {
        Assert.Equal(
            SeedData.Categories.Length,
            SeedData.Categories.Select(c => c.Slug).Distinct(StringComparer.OrdinalIgnoreCase).Count());

        Assert.Equal(
            SeedData.LetterTypes.Length,
            SeedData.LetterTypes.Select(l => l.Slug).Distinct(StringComparer.OrdinalIgnoreCase).Count());

        var categoryIds = SeedData.Categories.Select(c => c.Id).ToHashSet();
        Assert.All(SeedData.LetterTypes, letter => Assert.Contains(letter.CategoryId, categoryIds));
    }

    [Fact]
    public void Every_letter_has_editorial_structure_and_required_english_content()
    {
        foreach (var letter in SeedData.LetterTypes)
        {
            Assert.False(string.IsNullOrWhiteSpace(letter.NameEn));
            Assert.False(string.IsNullOrWhiteSpace(letter.SummaryEn));
            Assert.False(string.IsNullOrWhiteSpace(letter.PrimaryNextStepEn));
            Assert.False(string.IsNullOrWhiteSpace(letter.WhatToVerifyEn));

            var sections = SeedData.Sections
                .Where(section => section.LetterTypeId == letter.Id)
                .OrderBy(section => section.OrderIndex)
                .ToList();

            Assert.True(sections.Count >= 4, $"{letter.Slug} should have at least four sections.");
            Assert.Contains(
                sections,
                section => !string.IsNullOrWhiteSpace(section.ActionRequiredEn) || !string.IsNullOrWhiteSpace(section.Deadline));
            Assert.All(sections, section => Assert.False(string.IsNullOrWhiteSpace(section.ExplainerEn)));
        }
    }

    [Fact]
    public void Guidance_fields_cover_urgency_documents_and_contact_paths()
    {
        foreach (var letter in SeedData.LetterTypes)
        {
            var sections = SeedData.Sections.Where(section => section.LetterTypeId == letter.Id).ToList();
            var highestSeverity = sections.Max(section => section.Severity);

            Assert.False(string.IsNullOrWhiteSpace(letter.AppliesWhenEn));
            Assert.False(string.IsNullOrWhiteSpace(letter.RecommendedChannelEn));

            if (letter.NeedsDocuments)
            {
                Assert.Contains(
                    sections,
                    section => !string.IsNullOrWhiteSpace(section.ActionRequiredEn) || !string.IsNullOrWhiteSpace(section.Deadline));
            }

            if (highestSeverity == Mikhtav.Core.Models.Severity.Critical)
            {
                Assert.False(string.IsNullOrWhiteSpace(letter.WhenToContactAuthorityEn));
            }
        }
    }

    [Fact]
    public void Section_order_is_unique_and_contiguous_within_each_letter()
    {
        foreach (var letter in SeedData.LetterTypes)
        {
            var order = SeedData.Sections
                .Where(section => section.LetterTypeId == letter.Id)
                .OrderBy(section => section.OrderIndex)
                .Select(section => section.OrderIndex)
                .ToArray();

            Assert.Equal(order.Length, order.Distinct().Count());
            Assert.Equal(Enumerable.Range(1, order.Length), order);
        }
    }

    [Fact]
    public void Glossary_entries_have_unique_order_and_meaning()
    {
        Assert.Equal(
            SeedData.Glossary.Length,
            SeedData.Glossary.Select(term => term.OrderIndex).Distinct().Count());

        Assert.All(SeedData.Glossary, term =>
        {
            Assert.False(string.IsNullOrWhiteSpace(term.TermHe));
            Assert.False(string.IsNullOrWhiteSpace(term.Transliteration));
            Assert.False(string.IsNullOrWhiteSpace(term.MeaningEn));
        });
    }
}
