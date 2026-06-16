namespace Mikhtav.Core.Models;

/// <summary>A grouping of letter types by their issuing authority (Bituach Leumi, Mas Hachnasa, ...).</summary>
public class LetterCategory
{
    public int Id { get; set; }
    public string Slug { get; set; } = "";
    public string NameHe { get; set; } = "";
    public string NameEn { get; set; } = "";
    public string? NameRu { get; set; }
    public string? NameUk { get; set; }
    public string Issuer { get; set; } = "";
    public int OrderIndex { get; set; }

    public ICollection<LetterType> LetterTypes { get; set; } = new List<LetterType>();
}
