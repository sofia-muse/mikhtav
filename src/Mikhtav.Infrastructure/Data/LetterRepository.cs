using Microsoft.EntityFrameworkCore;
using Mikhtav.Core.Abstractions;
using Mikhtav.Core.Models;

namespace Mikhtav.Infrastructure.Data;

public class LetterRepository : ILetterRepository
{
    private readonly AppDbContext _db;

    public LetterRepository(AppDbContext db) => _db = db;

    public async Task<IReadOnlyList<LetterCategory>> GetCategoriesWithLettersAsync(CancellationToken ct = default) =>
        await _db.Categories
            .AsNoTracking()
            .Include(c => c.LetterTypes.OrderBy(l => l.OrderIndex))
            .OrderBy(c => c.OrderIndex)
            .ToListAsync(ct);

    public Task<LetterType?> GetLetterBySlugAsync(string slug, CancellationToken ct = default) =>
        _db.Letters
            .AsNoTracking()
            .Include(l => l.Category)
            .Include(l => l.Sections.OrderBy(s => s.OrderIndex))
            .FirstOrDefaultAsync(l => l.Slug == slug, ct);

    public async Task<IReadOnlyList<BureauTerm>> GetGlossaryAsync(CancellationToken ct = default) =>
        await _db.Glossary
            .AsNoTracking()
            .OrderBy(t => t.OrderIndex)
            .ToListAsync(ct);
}
