namespace Mikhtav.Core.Dtos;

/// <summary>Full letter type with all sections, localised to a single language.</summary>
public record LetterDetailDto(
    int Id,
    string Slug,
    string Name,
    string NameHe,
    string Issuer,
    string CategoryName,
    string Summary,
    IReadOnlyList<LetterSectionDto> Sections);

public record LetterSectionDto(
    int Order,
    string LabelHe,
    string Explainer,
    string? ActionRequired,
    string? Deadline,
    string Severity);
