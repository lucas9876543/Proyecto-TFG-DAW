using Kroos.API.Data;
using Kroos.API.DTOs;
using Kroos.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kroos.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PokemonsController : ControllerBase
{
    private readonly PokemonDbContext _context;

    public PokemonsController(PokemonDbContext context)
    {
        _context = context;
    }

    // GET: api/pokemons
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PokemonDto>>> GetPokemons()
    {
        return await _context.Pokemons
            .Select(p => new PokemonDto
            {
                Id = p.Id,
                UserId = p.UserId,
                FavoritePokemon = p.FavoritePokemon
            })
            .ToListAsync();
    }

    // GET: api/pokemons/5
    [HttpGet("{id}")]
    public async Task<ActionResult<PokemonDto>> GetPokemon(long id)
    {
        var pokemon = await _context.Pokemons.FindAsync(id);

        if (pokemon == null)
        {
            return NotFound();
        }

        return new PokemonDto
        {
            Id = pokemon.Id,
            UserId = pokemon.UserId,
            FavoritePokemon = pokemon.FavoritePokemon
        };
    }

    // GET: api/pokemons/user/5
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<PokemonDto>>> GetPokemonsByUser(long userId)
    {
        // Check if user exists
        if (!await _context.Users.AnyAsync(u => u.Id == userId))
        {
            return NotFound("User not found");
        }

        return await _context.Pokemons
            .Where(p => p.UserId == userId)
            .Select(p => new PokemonDto
            {
                Id = p.Id,
                UserId = p.UserId,
                FavoritePokemon = p.FavoritePokemon
            })
            .ToListAsync();
    }

    // POST: api/pokemons
    [HttpPost]
    public async Task<ActionResult<PokemonDto>> CreatePokemon(CreatePokemonDto createPokemonDto)
    {
        if (!await _context.Users.AnyAsync(u => u.Id == createPokemonDto.UserId))
        {
            return BadRequest("Invalid user ID");
        }

        var pokemon = new Pokemon
        {
            UserId = createPokemonDto.UserId,
            FavoritePokemon = createPokemonDto.FavoritePokemon
        };

        _context.Pokemons.Add(pokemon);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetPokemon),
            new { id = pokemon.Id },
            new PokemonDto
            {
                Id = pokemon.Id,
                UserId = pokemon.UserId,
                FavoritePokemon = pokemon.FavoritePokemon
            });
    }

    // PUT: api/pokemons/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePokemon(long id, UpdatePokemonDto updatePokemonDto)
    {
        var pokemon = await _context.Pokemons.FindAsync(id);
        if (pokemon == null)
        {
            return NotFound();
        }

        if (updatePokemonDto.FavoritePokemon != null)
        {
            pokemon.FavoritePokemon = updatePokemonDto.FavoritePokemon;
        }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PokemonExists(id))
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

    // DELETE: api/pokemons/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePokemon(long id)
    {
        var pokemon = await _context.Pokemons.FindAsync(id);
        if (pokemon == null)
        {
            return NotFound();
        }

        _context.Pokemons.Remove(pokemon);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool PokemonExists(long id)
    {
        return _context.Pokemons.Any(e => e.Id == id);
    }
}
