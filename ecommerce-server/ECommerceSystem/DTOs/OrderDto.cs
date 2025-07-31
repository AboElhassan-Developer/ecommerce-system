using ECommerceSystem.Enums;

namespace ECommerceSystem.DTOs
{
    public class OrderDto
    {
        public int Id { get; set; }
        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }

        public string UserEmail { get; set; } // ✅
        public List<OrderItemDto> Items { get; set; }
    }

}
