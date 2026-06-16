namespace Mikhtav.Core.Dtos;

/// <summary>One glossary term localised to a single language.</summary>
public record GlossaryTermDto(
    int Id,
    string TermHe,
    string Transliteration,
    string Meaning,
    string? UsageNote);
