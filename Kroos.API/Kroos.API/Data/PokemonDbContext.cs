using Kroos.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Kroos.API.Data
{
    public class PokemonDbContext : DbContext
    {
        public PokemonDbContext(DbContextOptions<PokemonDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Pokemon> Pokemons { get; set; } = null!;
        public DbSet<Showdown> Showdowns { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasColumnName("id")
                    .UseIdentityAlwaysColumn();
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Password).HasColumnName("password");

                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Configure Pokemon entity
            modelBuilder.Entity<Pokemon>(entity =>
            {
                entity.ToTable("pokemons");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasColumnName("id")
                    .UseIdentityAlwaysColumn();
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.FavoritePokemon).HasColumnName("favorite_pokemon");

                entity.HasOne(d => d.User)
                      .WithMany(p => p.Pokemons)
                      .HasForeignKey(d => d.UserId)
                      .HasConstraintName("pokemons_user_id_fkey");
            });

            // Configure Showdown entity
            modelBuilder.Entity<Showdown>(entity =>
            {
                entity.ToTable("showdowns");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasColumnName("id")
                    .UseIdentityAlwaysColumn();
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.Team).HasColumnName("team");
                entity.Property(e => e.NumWins).HasColumnName("num_wins");

                entity.HasOne(d => d.User)
                      .WithMany(p => p.Showdowns)
                      .HasForeignKey(d => d.UserId)
                      .HasConstraintName("showdowns_user_id_fkey");
            });
        }
    }
}
