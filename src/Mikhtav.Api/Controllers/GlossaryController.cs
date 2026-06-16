using Microsoft.AspNetCore.Mvc;
using Mikhtav.Core.Abstractions;

namespace Mikhtav.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GlossaryController : ControllerBase
{
    private readonly ILetterService _service;

    public GlossaryController(ILetterService service) => _service = service;

    /// <summary>Bureaucratic-Hebrew glossary, localised by ?lang.</summary>
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string lang = "en", CancellationToken ct = default)
        => Ok(await _service.GetGlossaryAsync(lang, ct));
}
