using Mikhtav.Core.Dtos;

namespace Mikhtav.Core.Abstractions;

public interface ILetterService
{
    Task<IReadOnlyList<CategoryDto>> GetIndexAsync(string lang, CancellationToken ct = default);
    Task<LetterDetailDto?> GetLetterBySlugAsync(string slug, string lang, CancellationToken ct = default);
    Task<IReadOnlyList<GlossaryTermDto>> GetGlossaryAsync(string lang, CancellationToken ct = default);
}
