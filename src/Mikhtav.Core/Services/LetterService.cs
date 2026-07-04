using Microsoft.Extensions.Logging;
using Mikhtav.Core.Abstractions;
using Mikhtav.Core.Dtos;
using Mikhtav.Core.Models;

namespace Mikhtav.Core.Services;

/// <summary>
/// Localises the raw multilingual entities into per-language DTOs the API surfaces. The
/// service falls back to English for any language we don't (yet) have content for, so the
/// frontend always renders something even when EN is the only translation present.
/// </summary>
public class LetterService : ILetterService
{
    private static readonly Dictionary<string, int> CommonLetterRanks = new(StringComparer.OrdinalIgnoreCase)
    {
        ["drisha-shnatit"] = 1,
        ["hov-bituach-leumi"] = 2,
        ["ishur-bituach"] = 3,
        ["chidush-teudat-zehut"] = 4,
    };

    private readonly ILetterRepository _repo;
    private readonly ILogger<LetterService> _logger;

    public LetterService(ILetterRepository repo, ILogger<LetterService> logger)
    {
        _repo = repo;
        _logger = logger;
    }

    public async Task<IReadOnlyList<CategoryDto>> GetIndexAsync(string lang, CancellationToken ct = default)
    {
        var categories = await _repo.GetCategoriesWithLettersAsync(ct);
        var index = categories
            .OrderBy(c => c.OrderIndex)
            .Select(c => new CategoryDto(
                c.Id,
                c.Slug,
                PickName(c, lang),
                c.Issuer,
                c.LetterTypes
                    .OrderBy(l => l.OrderIndex)
                    .Select(l => ToSummary(l, lang))
                    .ToList()))
            .ToList();

        _logger.LogInformation(
            "Loaded letter index for language {Language} with {CategoryCount} categories.",
            lang.ToLowerInvariant(),
            index.Count);

        return index;
    }

    public async Task<LetterDetailDto?> GetLetterBySlugAsync(string slug, string lang, CancellationToken ct = default)
    {
        var letter = await _repo.GetLetterBySlugAsync(slug, ct);
        if (letter is null)
        {
            _logger.LogWarning(
                "Letter detail not found for slug {Slug} and language {Language}.",
                slug,
                lang.ToLowerInvariant());
            return null;
        }

        var sections = letter.Sections
            .OrderBy(s => s.OrderIndex)
            .Select(s => new LetterSectionDto(
                s.OrderIndex,
                s.LabelHe,
                PickExplainer(s, lang),
                PickAction(s, lang),
                s.Deadline,
                s.Severity.ToString().ToLowerInvariant()))
            .ToList();

        var detail = new LetterDetailDto(
            letter.Id,
            letter.Slug,
            PickName(letter, lang),
            letter.NameHe,
            letter.Category?.Issuer ?? "",
            letter.Category is null ? "" : PickName(letter.Category, lang),
            PickSummary(letter, lang),
            BuildGuidance(letter, lang),
            sections);

        _logger.LogInformation(
            "Loaded letter detail for slug {Slug} and language {Language} with {SectionCount} sections.",
            slug,
            lang.ToLowerInvariant(),
            detail.Sections.Count);

        return detail;
    }

    public async Task<IReadOnlyList<GlossaryTermDto>> GetGlossaryAsync(string lang, CancellationToken ct = default)
    {
        var terms = await _repo.GetGlossaryAsync(ct);
        var glossary = terms
            .OrderBy(t => t.OrderIndex)
            .Select(t => new GlossaryTermDto(
                t.Id,
                t.TermHe,
                t.Transliteration,
                PickMeaning(t, lang),
                t.UsageNote))
            .ToList();

        _logger.LogInformation(
            "Loaded glossary for language {Language} with {TermCount} terms.",
            lang.ToLowerInvariant(),
            glossary.Count);

        return glossary;
    }

    private static string PickName(LetterCategory c, string lang) => lang.ToLowerInvariant() switch
    {
        "he" => c.NameHe,
        "ru" => c.NameRu ?? c.NameEn,
        "uk" or "ua" => c.NameUk ?? c.NameEn,
        _ => c.NameEn,
    };

    private static string PickName(LetterType l, string lang) => lang.ToLowerInvariant() switch
    {
        "he" => l.NameHe,
        "ru" => l.NameRu ?? l.NameEn,
        "uk" or "ua" => l.NameUk ?? l.NameEn,
        _ => l.NameEn,
    };

    private static string PickSummary(LetterType l, string lang) => lang.ToLowerInvariant() switch
    {
        "ru" => l.SummaryRu ?? l.SummaryEn,
        "uk" or "ua" => l.SummaryUk ?? l.SummaryEn,
        _ => l.SummaryEn,
    };

    private static string PickExplainer(LetterSection s, string lang) => lang.ToLowerInvariant() switch
    {
        "ru" => s.ExplainerRu ?? s.ExplainerEn,
        "uk" or "ua" => s.ExplainerUk ?? s.ExplainerEn,
        _ => s.ExplainerEn,
    };

    private static string? PickAction(LetterSection s, string lang) => lang.ToLowerInvariant() switch
    {
        "ru" => s.ActionRequiredRu ?? s.ActionRequiredEn,
        "uk" or "ua" => s.ActionRequiredUk ?? s.ActionRequiredEn,
        _ => s.ActionRequiredEn,
    };

    private static string PickMeaning(BureauTerm t, string lang) => lang.ToLowerInvariant() switch
    {
        "ru" => t.MeaningRu ?? t.MeaningEn,
        "uk" or "ua" => t.MeaningUk ?? t.MeaningEn,
        _ => t.MeaningEn,
    };

    private static string PickPrimaryNextStep(LetterType letter, string lang)
    {
        var step = lang.ToLowerInvariant() switch
        {
            "ru" => letter.PrimaryNextStepRu,
            "uk" or "ua" => letter.PrimaryNextStepUk,
            "he" => null,
            _ => letter.PrimaryNextStepEn,
        };

        if (!string.IsNullOrWhiteSpace(step))
        {
            return step;
        }

        var derivedAction = letter.Sections
            .OrderByDescending(s => s.Severity)
            .ThenBy(s => s.OrderIndex)
            .Select(s => PickAction(s, lang))
            .FirstOrDefault(action => !string.IsNullOrWhiteSpace(action));

        return derivedAction
            ?? letter.PrimaryNextStepEn
            ?? PickSummary(letter, lang);
    }

    private static string? PickOptional(string lang, string? en, string? ru, string? uk) => lang.ToLowerInvariant() switch
    {
        "ru" => ru ?? en,
        "uk" or "ua" => uk ?? en,
        _ => en,
    };

    private static LetterGuidanceDto BuildGuidance(LetterType letter, string lang)
    {
        var overallSeverity = letter.Sections.Count == 0
            ? Severity.Info
            : letter.Sections.Max(s => s.Severity);

        var deadlineSummary = letter.Sections
            .Where(s => !string.IsNullOrWhiteSpace(s.Deadline))
            .OrderByDescending(s => s.Severity)
            .ThenBy(s => s.OrderIndex)
            .Select(s => s.Deadline)
            .FirstOrDefault();

        return new LetterGuidanceDto(
            overallSeverity.ToString().ToLowerInvariant(),
            PickPrimaryNextStep(letter, lang),
            deadlineSummary,
            letter.NeedsDocuments,
            PickOptional(lang, letter.AppliesWhenEn, letter.AppliesWhenRu, letter.AppliesWhenUk),
            PickOptional(lang, letter.RecommendedChannelEn, letter.RecommendedChannelRu, letter.RecommendedChannelUk),
            PickOptional(lang, letter.WhenToContactAuthorityEn, letter.WhenToContactAuthorityRu, letter.WhenToContactAuthorityUk),
            PickOptional(lang, letter.WhatToVerifyEn, letter.WhatToVerifyRu, letter.WhatToVerifyUk));
    }

    private static LetterTypeSummaryDto ToSummary(LetterType letter, string lang)
    {
        var severity = letter.Sections.Count == 0
            ? Severity.Info
            : letter.Sections.Max(s => s.Severity);

        return new LetterTypeSummaryDto(
            letter.Id,
            letter.Slug,
            PickName(letter, lang),
            letter.NameHe,
            PickSummary(letter, lang),
            PickOptional(lang, letter.AppliesWhenEn, letter.AppliesWhenRu, letter.AppliesWhenUk),
            severity.ToString().ToLowerInvariant(),
            letter.Sections.Any(s => !string.IsNullOrWhiteSpace(s.ActionRequiredEn)),
            letter.Sections.Any(s => !string.IsNullOrWhiteSpace(s.Deadline)),
            CommonLetterRanks.TryGetValue(letter.Slug, out var rank) ? rank : null);
    }
}
