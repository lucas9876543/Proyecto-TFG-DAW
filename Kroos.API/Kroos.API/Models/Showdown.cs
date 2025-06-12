namespace Kroos.API.Models
{
    public class Showdown
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public string Team { get; set; } = null!;
        public int NumWins { get; set; }

        // Navigation property
        public User? User { get; set; }
    }
}
