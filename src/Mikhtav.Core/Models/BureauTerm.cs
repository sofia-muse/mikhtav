namespace Mikhtav.Core.Models;

/// <summary>A single glossary entry — a bureaucratic Hebrew term explained in each supported language.</summary>
public class BureauTerm
{
    public int Id { get; set; }

    public string TermHe { get; set; } = "";

    /// <summary>Latin-script transliteration (e.g. "Te'udat Zehut").</summary>
    public string Transliteration { get; set; } = "";

    public string MeaningEn { get; set; } = "";
    public string? MeaningRu { get; set; }
    public string? MeaningUk { get; set; }

    /// <summary>Optional context on when/where the term appears.</summary>
    public string? UsageNote { get; set; }

    public int OrderIndex { get; set; }
}
