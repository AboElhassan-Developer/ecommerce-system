using Microsoft.AspNetCore.Identity;

namespace ECommerceSystem.Models
{
    public class ApplicationUser:IdentityUser
    {
        public string FullName { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<WishlistItem> WishlistItems { get; set; }
    }
}
