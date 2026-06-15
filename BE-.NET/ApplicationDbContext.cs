using BE_.NET.Model;
using Microsoft.EntityFrameworkCore;
namespace BE_.NET;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public virtual DbSet<Employee> Employees => Set<Employee>();
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Employee>(entity =>
        {
            entity.ToTable("Employee", "dbo");
            entity.HasKey(e => new { e.Id });
            entity.Property(e => e.Id).HasColumnName("Id");
            entity.Property(e => e.Name).HasColumnName("Name");
            entity.Property(e => e.Birthdate).HasColumnName("BirthDate");
            entity.Property(e => e.Sex).HasColumnName("Sex");
            entity.Property(e => e.Address).HasColumnName("Address");
            entity.Property(e => e.Salary).HasColumnName("Salary");
            entity.Property(e => e.Nik).HasColumnName("NIK");
            entity.Property(e => e.EntryDate).HasColumnName("EntryDate");
            entity.Property(e => e.UpdateDate).HasColumnName("UpdateDate");
        });

    }
}