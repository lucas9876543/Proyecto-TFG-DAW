namespace Kroos.API.Models
{
    public class Pokemon
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public string FavoritePokemon { get; set; } = null!;

        // Navigation property
        public User? User { get; set; }
    }
}
