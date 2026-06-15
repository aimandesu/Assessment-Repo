namespace BE_.NET.Model;

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Employee")]
public partial class Employee
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Required]
    [MaxLength(30)]
    [Column("Name")]
    public string Name { get; set; } = null!;

    [Required]
    [Column("Birthdate", TypeName = "date")] 
    public DateTime Birthdate { get; set; }

    [Required]
    [Column("Sex")] 
    public bool Sex { get; set; }

    [MaxLength(200)]
    [Column("Address")] 
    public string? Address { get; set; }

    [Required]
    [Column("Salary", TypeName = "numeric(12,4)")] 
    public decimal Salary { get; set; }

    [Required]
    [MaxLength(10)]
    [Column("NIK")] 
    public string Nik { get; set; } = null!;

    [Column("EntryDate", TypeName = "datetime")] 
    public DateTime? EntryDate { get; set; }

    [Column("UpdateDate", TypeName = "datetime")] 
    public DateTime? UpdateDate { get; set; }
}
