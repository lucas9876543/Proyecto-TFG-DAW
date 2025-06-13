using Kroos.API.Data;
using Kroos.API.DTOs;
using Kroos.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace Kroos.API.Controllers;

[Route("auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly PokemonDbContext _context;

    public AuthController(PokemonDbContext context)
    {
        _context = context;
    }

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
            Token = GenerateToken(user), // Opcional: puedes generar un JWT token
            Message = "Login exitoso"
        });
    }

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    private string GenerateToken(User user)
    {
        // Por ahora retornamos un token simple
        // En producción deberías usar JWT
        return Convert.ToBase64String(Encoding.UTF8.GetBytes($"{user.Id}:{user.Email}:{DateTime.UtcNow}"));
    }
}
