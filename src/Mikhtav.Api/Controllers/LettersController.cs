using Microsoft.AspNetCore.Mvc;
using Mikhtav.Core.Abstractions;

namespace Mikhtav.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LettersController : ControllerBase
{
    private readonly ILetterService _service;

    public LettersController(ILetterService service) => _service = service;

    /// <summary>Indexed list of letter categories with their letter types, localised by ?lang.</summary>
    [HttpGet]
    public async Task<IActionResult> Index([FromQuery] string lang = "en", CancellationToken ct = default)
        => Ok(await _service.GetIndexAsync(lang, ct));

    /// <summary>Full breakdown of one letter type by slug, localised by ?lang.</summary>
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug, [FromQuery] string lang = "en", CancellationToken ct = default)
    {
        var dto = await _service.GetLetterBySlugAsync(slug, lang, ct);
        return dto is null ? NotFound() : Ok(dto);
    }
}
