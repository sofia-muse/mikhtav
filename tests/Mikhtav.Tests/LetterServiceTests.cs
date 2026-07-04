using Microsoft.Extensions.Logging;
using Mikhtav.Core.Abstractions;
using Mikhtav.Core.Models;
using Mikhtav.Core.Services;
using Xunit;

namespace Mikhtav.Tests;

public class LetterServiceTests
{
    [Fact]
    public async Task GetLetterBySlug_returns_hebrew_label_localised_explainer_and_logs_result()
    {
        var logger = new TestLogger<LetterService>();
        var sut = CreateSut(logger);

        var detail = await sut.GetLetterBySlugAsync("drisha-shnatit", "ru");

        Assert.NotNull(detail);
        Assert.Equal("דוגמה", detail!.NameHe);
        Assert.Equal("Образец", detail.Name);
        Assert.Single(detail.Sections);
        Assert.Equal("פרטים", detail.Sections[0].LabelHe);
        Assert.Equal("Личные данные.", detail.Sections[0].Explainer);
        Assert.Equal("info", detail.Guidance.OverallSeverity);
        Assert.Equal("Принесите подтверждающие документы.", detail.Guidance.PrimaryNextStep);
        Assert.Equal("Within 30 days", detail.Guidance.DeadlineSummary);
        Assert.True(detail.Guidance.NeedsDocuments);
        Assert.Equal("Upload through the personal area.", detail.Guidance.RecommendedChannel);
        Assert.Contains(
            logger.Entries,
            entry => entry.Level == LogLevel.Information
                && entry.Message.Contains("Loaded letter detail")
                && entry.Message.Contains("drisha-shnatit")
                && entry.Message.Contains("ru")
                && entry.Message.Contains("1 sections"));
    }

    [Fact]
    public async Task GetLetterBySlug_falls_back_to_English_when_translation_missing()
    {
        var sut = CreateSut();

        var detail = await sut.GetLetterBySlugAsync("drisha-shnatit", "uk");

        Assert.NotNull(detail);
        Assert.Equal("Sample", detail!.Name);
        Assert.Equal("Personal details.", detail.Sections[0].Explainer);
        Assert.Equal("Bring supporting proof.", detail.Guidance.PrimaryNextStep);
        Assert.Equal("Check the case number and deadline.", detail.Guidance.WhatToVerify);
    }

    [Fact]
    public async Task GetLetterBySlug_returns_null_and_logs_warning_when_slug_missing()
    {
        var logger = new TestLogger<LetterService>();
        var sut = CreateSut(logger);

        var detail = await sut.GetLetterBySlugAsync("missing", "en");

        Assert.Null(detail);
        Assert.Contains(
            logger.Entries,
            entry => entry.Level == LogLevel.Warning
                && entry.Message.Contains("not found")
                && entry.Message.Contains("missing")
                && entry.Message.Contains("en"));
    }

    [Fact]
    public async Task GetIndex_groups_letters_by_category_in_orderIndex_order_and_logs_count()
    {
        var logger = new TestLogger<LetterService>();
        var sut = CreateSut(logger);

        var index = await sut.GetIndexAsync("en");

        Assert.Single(index);
        Assert.Equal("Sample category", index[0].Name);
        Assert.Single(index[0].Letters);
        Assert.Equal("Sample", index[0].Letters[0].Name);
        Assert.Equal("the office needs more evidence before it can decide the case", index[0].Letters[0].TriageHint);
        Assert.Equal("info", index[0].Letters[0].Severity);
        Assert.True(index[0].Letters[0].HasActionRequired);
        Assert.True(index[0].Letters[0].HasDeadline);
        Assert.Equal(1, index[0].Letters[0].CommonRank);
        Assert.Contains(
            logger.Entries,
            entry => entry.Level == LogLevel.Information
                && entry.Message.Contains("Loaded letter index")
                && entry.Message.Contains("en")
                && entry.Message.Contains("1 categories"));
    }

    [Fact]
    public async Task GetGlossary_returns_terms_in_order_and_logs_count()
    {
        var logger = new TestLogger<LetterService>();
        var sut = CreateSut(logger);

        var glossary = await sut.GetGlossaryAsync("ru");

        Assert.Single(glossary);
        Assert.Equal("טופס", glossary[0].TermHe);
        Assert.Equal("Бланк", glossary[0].Meaning);
        Assert.Contains(
            logger.Entries,
            entry => entry.Level == LogLevel.Information
                && entry.Message.Contains("Loaded glossary")
                && entry.Message.Contains("ru")
                && entry.Message.Contains("1 terms"));
    }

    private static LetterService CreateSut(TestLogger<LetterService>? logger = null, ILetterRepository? repo = null) =>
        new(repo ?? new InMemoryRepo(), logger ?? new TestLogger<LetterService>());

    private sealed class InMemoryRepo : ILetterRepository
    {
        private readonly LetterCategory _category = new()
        {
            Id = 1, Slug = "sample-category", Issuer = "Sample Authority", OrderIndex = 1,
            NameHe = "קטגוריה לדוגמה", NameEn = "Sample category",
        };

        private readonly LetterType _letter;
        private readonly LetterSection _section;
        private readonly BureauTerm _term;

        public InMemoryRepo()
        {
            _section = new LetterSection
            {
                Id = 1, LetterTypeId = 1, OrderIndex = 1,
                LabelHe = "פרטים",
                ExplainerEn = "Personal details.",
                ExplainerRu = "Личные данные.",
                ActionRequiredEn = "Bring supporting proof.",
                ActionRequiredRu = "Принесите подтверждающие документы.",
                Deadline = "Within 30 days",
                Severity = Severity.Info,
            };
            _letter = new LetterType
            {
                Id = 1, CategoryId = 1, Slug = "drisha-shnatit", OrderIndex = 1,
                NameHe = "דוגמה", NameEn = "Sample", NameRu = "Образец",
                SummaryEn = "An example.",
                PrimaryNextStepEn = "Bring supporting proof.",
                AppliesWhenEn = "the office needs more evidence before it can decide the case",
                NeedsDocuments = true,
                RecommendedChannelEn = "Upload through the personal area.",
                WhenToContactAuthorityEn = "the request mentions the wrong case.",
                WhatToVerifyEn = "Check the case number and deadline.",
                Category = _category,
                Sections = new[] { _section },
            };
            _term = new BureauTerm
            {
                Id = 1,
                TermHe = "טופס",
                Transliteration = "Tofes",
                MeaningEn = "Form",
                MeaningRu = "Бланк",
                UsageNote = "Issued by the authority.",
                OrderIndex = 1,
            };
            _category.LetterTypes = new[] { _letter };
        }

        public Task<IReadOnlyList<LetterCategory>> GetCategoriesWithLettersAsync(CancellationToken ct = default) =>
            Task.FromResult<IReadOnlyList<LetterCategory>>(new[] { _category });

        public Task<LetterType?> GetLetterBySlugAsync(string slug, CancellationToken ct = default) =>
            Task.FromResult<LetterType?>(slug == _letter.Slug ? _letter : null);

        public Task<IReadOnlyList<BureauTerm>> GetGlossaryAsync(CancellationToken ct = default) =>
            Task.FromResult<IReadOnlyList<BureauTerm>>(new[] { _term });
    }

    private sealed record LogEntry(LogLevel Level, string Message);

    private sealed class TestLogger<T> : ILogger<T>
    {
        public List<LogEntry> Entries { get; } = [];

        public IDisposable BeginScope<TState>(TState state)
            where TState : notnull =>
            NullScope.Instance;

        public bool IsEnabled(LogLevel logLevel) => true;

        public void Log<TState>(
            LogLevel logLevel,
            EventId eventId,
            TState state,
            Exception? exception,
            Func<TState, Exception?, string> formatter)
        {
            Entries.Add(new LogEntry(logLevel, formatter(state, exception)));
        }
    }

    private sealed class NullScope : IDisposable
    {
        public static NullScope Instance { get; } = new();

        public void Dispose()
        {
        }
    }
}
