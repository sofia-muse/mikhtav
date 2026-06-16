namespace Mikhtav.Core.Models;

/// <summary>A specific kind of letter people receive (e.g. NII enrolment confirmation, tax demand).</summary>
public class LetterType
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public LetterCategory? Category { get; set; }

    public string Slug { get; set; } = "";
    public string NameHe { get; set; } = "";
    public string NameEn { get; set; } = "";
    public string? NameRu { get; set; }
    public string? NameUk { get; set; }

    public string SummaryEn { get; set; } = "";
    public string? SummaryRu { get; set; }
    public string? SummaryUk { get; set; }

    public int OrderIndex { get; set; }

    public ICollection<LetterSection> Sections { get; set; } = new List<LetterSection>();
}
