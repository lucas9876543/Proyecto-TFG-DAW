using Kroos.API.Data;
using Kroos.API.DTOs;
using Kroos.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Kroos.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ShowdownsController : ControllerBase
{
    private readonly PokemonDbContext _context;

    public ShowdownsController(PokemonDbContext context)
    {
        _context = context;
    }

    // GET: api/showdowns
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ShowdownDto>>> GetShowdowns()
    {
        return await _context.Showdowns
            .Select(s => new ShowdownDto
            {
                Id = s.Id,
                UserId = s.UserId,
                Team = s.Team,
                NumWins = s.NumWins
            })
            .ToListAsync();
    }

    // GET: api/showdowns/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ShowdownDto>> GetShowdown(long id)
    {
        var showdown = await _context.Showdowns.FindAsync(id);

        if (showdown == null)
        {
            return NotFound();
        }

        return new ShowdownDto
        {
            Id = showdown.Id,
            UserId = showdown.UserId,
            Team = showdown.Team,
            NumWins = showdown.NumWins
        };
    }

    // GET: api/showdowns/user/5
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<ShowdownDto>>> GetShowdownsByUser(long userId)
    {
        // Check if user exists
        if (!await _context.Users.AnyAsync(u => u.Id == userId))
        {
            return NotFound("User not found");
        }

        return await _context.Showdowns
            .Where(s => s.UserId == userId)
            .Select(s => new ShowdownDto
            {
                Id = s.Id,
                UserId = s.UserId,
                Team = s.Team,
                NumWins = s.NumWins
            })
            .ToListAsync();
    }

    // POST: api/showdowns
    [HttpPost]
    public async Task<ActionResult<ShowdownDto>> CreateShowdown(CreateShowdownDto createShowdownDto)
    {
        // Check if user exists
        if (!await _context.Users.AnyAsync(u => u.Id == createShowdownDto.UserId))
        {
            return BadRequest("Invalid user ID");
        }

        var showdown = new Showdown
        {
            UserId = createShowdownDto.UserId,
            Team = createShowdownDto.Team,
            NumWins = createShowdownDto.NumWins
        };

        _context.Showdowns.Add(showdown);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetShowdown),
            new { id = showdown.Id },
            new ShowdownDto
            {
                Id = showdown.Id,
                UserId = showdown.UserId,
                Team = showdown.Team,
                NumWins = showdown.NumWins
            });
    }

    // PUT: api/showdowns/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateShowdown(long id, UpdateShowdownDto updateShowdownDto)
    {
        var showdown = await _context.Showdowns.FindAsync(id);
        if (showdown == null)
        {
            return NotFound();
        }

        if (updateShowdownDto.Team != null)
        {
            showdown.Team = updateShowdownDto.Team;
        }

        if (updateShowdownDto.NumWins.HasValue)
        {
            showdown.NumWins = updateShowdownDto.NumWins.Value;
        }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ShowdownExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/showdowns/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteShowdown(long id)
    {
        var showdown = await _context.Showdowns.FindAsync(id);
        if (showdown == null)
        {
            return NotFound();
        }

        _context.Showdowns.Remove(showdown);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ShowdownExists(long id)
    {
        return _context.Showdowns.Any(e => e.Id == id);
    }
}
