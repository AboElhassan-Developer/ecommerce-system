using System.ComponentModel.DataAnnotations;

namespace ECommerceSystem.DTOs
{
    public class CategoryUpdateDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
    }
}
