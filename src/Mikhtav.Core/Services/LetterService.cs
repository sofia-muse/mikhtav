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
    private readonly ILetterRepository _repo;

    public LetterService(ILetterRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<CategoryDto>> GetIndexAsync(string lang, CancellationToken ct = default)
    {
        var categories = await _repo.GetCategoriesWithLettersAsync(ct);
        return categories
            .OrderBy(c => c.OrderIndex)
            .Select(c => new CategoryDto(
                c.Id,
                c.Slug,
                PickName(c, lang),
                c.Issuer,
                c.LetterTypes
                    .OrderBy(l => l.OrderIndex)
                    .Select(l => new LetterTypeSummaryDto(
                        l.Id, l.Slug, PickName(l, lang), l.NameHe, PickSummary(l, lang)))
                    .ToList()))
            .ToList();
    }

    public async Task<LetterDetailDto?> GetLetterBySlugAsync(string slug, string lang, CancellationToken ct = default)
    {
        var letter = await _repo.GetLetterBySlugAsync(slug, ct);
        if (letter is null) return null;

        return new LetterDetailDto(
            letter.Id,
            letter.Slug,
            PickName(letter, lang),
            letter.NameHe,
            letter.Category?.Issuer ?? "",
            letter.Category is null ? "" : PickName(letter.Category, lang),
            PickSummary(letter, lang),
            letter.Sections
                .OrderBy(s => s.OrderIndex)
                .Select(s => new LetterSectionDto(
                    s.OrderIndex,
                    s.LabelHe,
                    PickExplainer(s, lang),
                    PickAction(s, lang),
                    s.Deadline,
                    s.Severity.ToString().ToLowerInvariant()))
                .ToList());
    }

    public async Task<IReadOnlyList<GlossaryTermDto>> GetGlossaryAsync(string lang, CancellationToken ct = default)
    {
        var terms = await _repo.GetGlossaryAsync(ct);
        return terms
            .OrderBy(t => t.OrderIndex)
            .Select(t => new GlossaryTermDto(
                t.Id,
                t.TermHe,
                t.Transliteration,
                PickMeaning(t, lang),
                t.UsageNote))
            .ToList();
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
}
