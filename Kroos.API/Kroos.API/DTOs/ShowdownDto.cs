namespace Kroos.API.DTOs
{
    public class ShowdownDto
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public string Team { get; set; } = null!;
        public int NumWins { get; set; }
    }

    public class CreateShowdownDto
    {
        public long UserId { get; set; }
        public string Team { get; set; } = null!;
        public int NumWins { get; set; }
    }

    public class UpdateShowdownDto
    {
        public string? Team { get; set; }
        public int? NumWins { get; set; }
    }
}
