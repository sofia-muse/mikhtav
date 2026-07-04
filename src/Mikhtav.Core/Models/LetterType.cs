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

    public string PrimaryNextStepEn { get; set; } = "";
    public string? PrimaryNextStepRu { get; set; }
    public string? PrimaryNextStepUk { get; set; }

    public string? AppliesWhenEn { get; set; }
    public string? AppliesWhenRu { get; set; }
    public string? AppliesWhenUk { get; set; }

    public bool NeedsDocuments { get; set; }

    public string? RecommendedChannelEn { get; set; }
    public string? RecommendedChannelRu { get; set; }
    public string? RecommendedChannelUk { get; set; }

    public string? WhenToContactAuthorityEn { get; set; }
    public string? WhenToContactAuthorityRu { get; set; }
    public string? WhenToContactAuthorityUk { get; set; }

    public string? WhatToVerifyEn { get; set; }
    public string? WhatToVerifyRu { get; set; }
    public string? WhatToVerifyUk { get; set; }

    public int OrderIndex { get; set; }

    public ICollection<LetterSection> Sections { get; set; } = new List<LetterSection>();
}
