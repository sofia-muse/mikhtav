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
    LetterGuidanceDto Guidance,
    IReadOnlyList<LetterSectionDto> Sections);

public record LetterGuidanceDto(
    string OverallSeverity,
    string PrimaryNextStep,
    string? DeadlineSummary,
    bool NeedsDocuments,
    string? AppliesWhen,
    string? RecommendedChannel,
    string? WhenToContactAuthority,
    string? WhatToVerify);

public record LetterSectionDto(
    int Order,
    string LabelHe,
    string Explainer,
    string? ActionRequired,
    string? Deadline,
    string Severity);
