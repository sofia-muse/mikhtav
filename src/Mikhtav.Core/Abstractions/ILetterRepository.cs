using Mikhtav.Core.Models;

namespace Mikhtav.Core.Abstractions;

public interface ILetterRepository
{
    Task<IReadOnlyList<LetterCategory>> GetCategoriesWithLettersAsync(CancellationToken ct = default);
    Task<LetterType?> GetLetterBySlugAsync(string slug, CancellationToken ct = default);
    Task<IReadOnlyList<BureauTerm>> GetGlossaryAsync(CancellationToken ct = default);
}
