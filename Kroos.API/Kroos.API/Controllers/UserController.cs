using Kroos.API.Data;
using Kroos.API.DTOs;
using Kroos.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace Kroos.API.Controllers;

[Route("user")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly PokemonDbContext _context;

    public UsersController(PokemonDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        return await _context.Users
            .Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email
            })
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(long id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email
        };
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto createUserDto)
    {
        // Check if email already exists
        if (await _context.Users.AnyAsync(u => u.Email == createUserDto.Email))
        {
            return BadRequest("Email already in use");
        }

        var user = new User
        {
            Username = createUserDto.Username,
            Email = createUserDto.Email,
            Password = HashPassword(createUserDto.Password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(
            new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email
            });
    }

    // NUEVO MÉTODO DE LOGIN
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(LoginDto loginDto)
    {
        // Buscar usuario por email
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        if (user == null)
        {
            return BadRequest("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
        }

        // Verificar contraseña
        var hashedPassword = HashPassword(loginDto.Password);
        if (user.Password != hashedPassword)
        {
            return BadRequest("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
        }

        // Login exitoso
        return Ok(new LoginResponseDto
        {
            User = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email
            },
            Token = GenerateToken(user),
            Message = "Login exitoso"
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(long id, UpdateUserDto updateUserDto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        if (updateUserDto.Email != null && updateUserDto.Email != user.Email)
        {
            // Check if the new email is already in use
            if (await _context.Users.AnyAsync(u => u.Email == updateUserDto.Email))
            {
                return BadRequest("Email already in use");
            }
            user.Email = updateUserDto.Email;
        }

        if (updateUserDto.Username != null)
        {
            user.Username = updateUserDto.Username;
        }

        if (updateUserDto.Password != null)
        {
            user.Password = HashPassword(updateUserDto.Password);
        }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!UserExists(id))
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

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(long id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool UserExists(long id)
    {
        return _context.Users.Any(e => e.Id == id);
    }

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    private string GenerateToken(User user)
    {
        // Token simple para desarrollo (En PRO se usa JWT)
        return Convert.ToBase64String(Encoding.UTF8.GetBytes($"{user.Id}:{user.Email}:{DateTime.UtcNow}"));
    }
}