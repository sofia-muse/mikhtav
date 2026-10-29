using System.Text.Json;
using Mikhtav.Core.Dtos;
using Mikhtav.Core.Abstractions;

namespace Mikhtav.Core.Content;

// Published editorial content is versioned separately from database identity and structure.
// Both the API and static exporter use this projection; a future CMS can supply these records.
public sealed class EditorialCatalog : IEditorialCatalog
{
    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);
    private readonly Dictionary<(string, string), LetterTranslation> Letters;
    private readonly Dictionary<(string, string), CategoryTranslation> Categories;
    private readonly Dictionary<(int, string), TermTranslation> Terms;
    private readonly Dictionary<string, EditorialProvenance> Provenance;

    public EditorialCatalog()
    {
        var data = Read<Translations>("translations.json");
        Letters = data.Letters.ToDictionary(t => (t.Slug, t.Language));
        Categories = data.Categories.ToDictionary(t => (t.Slug, t.Language));
        Terms = data.Glossary.ToDictionary(t => (t.Id, t.Language));
        Provenance = Read<List<EditorialProvenance>>("provenance.json").ToDictionary(p => p.Slug);
    }

    public string NormalizeLanguage(string language)
    {
        var code = language.Split('-', '_')[0].ToLowerInvariant();
        return code switch { "ua" => "uk", "en" or "he" or "ru" or "uk" => code, _ => "en" };
    }

    public CategoryDto Localize(CategoryDto category, string language)
    {
        var lang = NormalizeLanguage(language);
        Categories.TryGetValue((category.Slug, lang), out var translation);
        return category with
        {
            Name = translation?.Name ?? category.Name,
            Issuer = translation?.Issuer ?? category.Issuer,
            Letters = category.Letters.Select(l => Localize(l, lang)).ToList()
        };
    }

    private LetterTypeSummaryDto Localize(LetterTypeSummaryDto letter, string lang)
    {
        if (!Letters.TryGetValue((letter.Slug, lang), out var translation)) return letter;
        return letter with
        {
            Name = translation.Name, Summary = translation.Summary, TriageHint = translation.AppliesWhen,
            HasActionRequired = translation.Sections.Any(s => !string.IsNullOrWhiteSpace(s.ActionRequired)),
            HasDeadline = translation.Sections.Any(s => !string.IsNullOrWhiteSpace(s.Deadline))
        };
    }

    public LetterDetailDto Localize(LetterDetailDto letter, string categorySlug, string language)
    {
        var lang = NormalizeLanguage(language);
        Letters.TryGetValue((letter.Slug, lang), out var translation);
        Categories.TryGetValue((categorySlug, lang), out var category);
        var sections = letter.Sections.Select(section =>
        {
            var text = translation?.Sections.SingleOrDefault(s => s.Order == section.Order);
            return text is null ? section : section with
            { Explainer = text.Explainer, ActionRequired = text.ActionRequired, Deadline = text.Deadline };
        }).ToList();
        var deadline = sections.Where(s => !string.IsNullOrWhiteSpace(s.Deadline))
            .OrderByDescending(s => s.Severity == "critical" ? 2 : s.Severity == "warning" ? 1 : 0)
            .ThenBy(s => s.Order).Select(s => s.Deadline).FirstOrDefault();
        return letter with
        {
            Name = translation?.Name ?? letter.Name,
            Summary = translation?.Summary ?? letter.Summary,
            Issuer = category?.Issuer ?? letter.Issuer,
            CategoryName = category?.Name ?? letter.CategoryName,
            Sections = sections,
            Guidance = translation is null ? letter.Guidance : letter.Guidance with
            {
                PrimaryNextStep = translation.PrimaryNextStep,
                AppliesWhen = translation.AppliesWhen,
                RecommendedChannel = translation.RecommendedChannel,
                WhenToContactAuthority = translation.WhenToContactAuthority,
                WhatToVerify = translation.WhatToVerify,
                DeadlineSummary = deadline
            },
            Editorial = Provenance.GetValueOrDefault(letter.Slug),
            TranslationComplete = translation is not null &&
                (lang == "en" || category is not null) &&
                new[] { translation.Name, translation.Summary, translation.PrimaryNextStep,
                    translation.AppliesWhen, translation.RecommendedChannel,
                    translation.WhenToContactAuthority, translation.WhatToVerify }
                    .All(value => !string.IsNullOrWhiteSpace(value)) &&
                sections.Count == translation.Sections.Count &&
                letter.Sections.All(s => translation.Sections.Any(t => t.Order == s.Order &&
                    !string.IsNullOrWhiteSpace(t.Explainer)))
        };
    }

    public GlossaryTermDto Localize(GlossaryTermDto term, string language) =>
        Terms.TryGetValue((term.Id, NormalizeLanguage(language)), out var text)
            ? term with { Meaning = text.Meaning, UsageNote = text.UsageNote } : term;

    private static T Read<T>(string name)
    {
        using var stream = typeof(EditorialCatalog).Assembly.GetManifestResourceStream($"Mikhtav.Content.{name}")
            ?? throw new InvalidOperationException($"Missing editorial resource: {name}");
        return JsonSerializer.Deserialize<T>(stream, Json)
            ?? throw new InvalidOperationException($"Invalid editorial resource: {name}");
    }

    private sealed record Translations(List<LetterTranslation> Letters, List<CategoryTranslation> Categories, List<TermTranslation> Glossary);
    private sealed record LetterTranslation(string Slug, string Language, string Name, string Summary,
        string PrimaryNextStep, string? AppliesWhen, string? RecommendedChannel,
        string? WhenToContactAuthority, string? WhatToVerify, List<SectionTranslation> Sections);
    private sealed record SectionTranslation(int Order, string Explainer, string? ActionRequired, string? Deadline);
    private sealed record CategoryTranslation(string Slug, string Language, string Name, string Issuer);
    private sealed record TermTranslation(int Id, string Language, string Meaning, string? UsageNote);
}

public record EditorialProvenance(string Slug, string Version, string SourceCheckedOn, IReadOnlyList<EditorialSource> Sources);
public record EditorialSource(string Url, string Title, string Scope)
{
    public IReadOnlyDictionary<string, string>? ScopeTranslations { get; init; }
}
