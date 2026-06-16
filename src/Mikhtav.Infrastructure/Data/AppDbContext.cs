using Microsoft.EntityFrameworkCore;
using Mikhtav.Core.Models;

namespace Mikhtav.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<LetterCategory> Categories => Set<LetterCategory>();
    public DbSet<LetterType> Letters => Set<LetterType>();
    public DbSet<LetterSection> Sections => Set<LetterSection>();
    public DbSet<BureauTerm> Glossary => Set<BureauTerm>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<LetterCategory>(e =>
        {
            e.HasIndex(c => c.Slug).IsUnique();
            e.HasMany(c => c.LetterTypes).WithOne(l => l.Category!).HasForeignKey(l => l.CategoryId);
        });

        b.Entity<LetterType>(e =>
        {
            e.HasIndex(l => l.Slug).IsUnique();
            e.HasMany(l => l.Sections).WithOne(s => s.LetterType!).HasForeignKey(s => s.LetterTypeId);
        });

        b.Entity<LetterCategory>().HasData(SeedData.Categories);
        b.Entity<LetterType>().HasData(SeedData.LetterTypes);
        b.Entity<LetterSection>().HasData(SeedData.Sections);
        b.Entity<BureauTerm>().HasData(SeedData.Glossary);
    }
}
