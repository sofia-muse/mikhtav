using Mikhtav.Core.Dtos;

namespace Mikhtav.Core.Abstractions;

/// <summary>Projects versioned editorial content independently of structural storage.</summary>
public interface IEditorialCatalog
{
    string NormalizeLanguage(string language);
    CategoryDto Localize(CategoryDto category, string language);
    LetterDetailDto Localize(LetterDetailDto letter, string categorySlug, string language);
    GlossaryTermDto Localize(GlossaryTermDto term, string language);
}
