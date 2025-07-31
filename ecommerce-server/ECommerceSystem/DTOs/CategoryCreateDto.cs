using System.ComponentModel.DataAnnotations;

namespace ECommerceSystem.DTOs
{
    public class CategoryCreateDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
    }
}
