namespace Kroos.API.Models
{
    public class User
    {
        public long Id { get; set; }
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;

        // Navigation properties
        public List<Pokemon> Pokemons { get; set; } = new();
        public List<Showdown> Showdowns { get; set; } = new();
    }
}
