using System.ComponentModel.DataAnnotations;

namespace ECommerceSystem.DTOs
{
    public class CreateProductDto
    {
        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }

        public int Quantity { get; set; }

        public IFormFile? Image { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "CategoryId must be greater than 0")]

        public int CategoryId { get; set; }
    }
}
