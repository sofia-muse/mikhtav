namespace Mikhtav.Core.Dtos;

/// <summary>Catalog grouping localised to a single language.</summary>
public record CategoryDto(int Id, string Slug, string Name, string Issuer, IReadOnlyList<LetterTypeSummaryDto> Letters);

public record LetterTypeSummaryDto(
    int Id,
    string Slug,
    string Name,
    string NameHe,
    string Summary,
    string? TriageHint,
    string Severity,
    bool HasActionRequired,
    bool HasDeadline,
    int? CommonRank);
