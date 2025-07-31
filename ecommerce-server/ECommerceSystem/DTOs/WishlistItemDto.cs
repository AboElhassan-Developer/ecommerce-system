using System.Text.Json.Serialization;

namespace ECommerceSystem.DTOs
{
    public class WishlistItemDto
    {
        public int? Id { get; set; }
        [JsonIgnore]
        public string? UserId { get; set; }
        public int ProductId { get; set; }

        public string? ProductName { get; set; }
        public string? ProductImage { get; set; }
    }
}
