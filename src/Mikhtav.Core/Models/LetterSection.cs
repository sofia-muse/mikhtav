namespace Mikhtav.Core.Models;

/// <summary>One section of a letter type — the HE label as it appears, plus the explainer in each language.</summary>
public class LetterSection
{
    public int Id { get; set; }
    public int LetterTypeId { get; set; }
    public LetterType? LetterType { get; set; }

    public int OrderIndex { get; set; }

    /// <summary>The Hebrew section heading as it appears on the actual letter.</summary>
    public string LabelHe { get; set; } = "";

    public string ExplainerEn { get; set; } = "";
    public string? ExplainerRu { get; set; }
    public string? ExplainerUk { get; set; }

    /// <summary>The action this section asks of the reader, if any.</summary>
    public string? ActionRequiredEn { get; set; }
    public string? ActionRequiredRu { get; set; }
    public string? ActionRequiredUk { get; set; }

    /// <summary>Free-text description of the deadline (e.g. "30 days from notice date").</summary>
    public string? Deadline { get; set; }

    public Severity Severity { get; set; } = Severity.Info;
}
