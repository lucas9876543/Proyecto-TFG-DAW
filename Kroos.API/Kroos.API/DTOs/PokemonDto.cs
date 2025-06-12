namespace Kroos.API.DTOs
{
    public class PokemonDto
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public string FavoritePokemon { get; set; } = null!;
    }

    public class CreatePokemonDto
    {
        public long UserId { get; set; }
        public string FavoritePokemon { get; set; } = null!;
    }

    public class UpdatePokemonDto
    {
        public string? FavoritePokemon { get; set; }
    }
}
