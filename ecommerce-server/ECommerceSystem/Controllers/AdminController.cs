using ECommerceSystem.DTOs;
using ECommerceSystem.Enums;
using ECommerceSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerceSystem.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ECommerceDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public AdminController(ECommerceDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }




        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new {
                    u.Id,
                    u.Email,
                    u.FullName,
                    Role = (from ur in _context.UserRoles
                            join r in _context.Roles on ur.RoleId equals r.Id
                            where ur.UserId == u.Id
                            select r.Name).FirstOrDefault()
                }).ToListAsync();

            return Ok(users);
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            await _userManager.DeleteAsync(user);
            return Ok(new { message = "User deleted successfully" });
        }

        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> UpdateUserRole(string id, [FromBody] RoleDto dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Role))
                return BadRequest("Role is required");

            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            var roles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, roles);
            await _userManager.AddToRoleAsync(user, dto.Role);

            return Ok(new { message = "User role updated successfully" });
        }



        
        [HttpGet("orders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.User)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            var result = orders.Select(order => new OrderDto
            {
                Id = order.Id,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                CreatedAt = order.CreatedAt,
                UserEmail = order.User?.Email ?? "",
                Items = order.OrderItems.Select(oi => new OrderItemDto
                {
                    ProductId = oi.ProductId,
                    ProductName = oi.Product?.Name,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    ImageUrl = oi.Product?.Image
                }).ToList()
            }).ToList();

            return Ok(result);
        }

        [HttpGet("revenue")]
        public async Task<IActionResult> GetTotalRevenue()
        {
            var total = await _context.Orders.SumAsync(o => o.TotalAmount);
            return Ok(new { revenue = total });
        }

        [HttpGet("orders/count")]
        public async Task<IActionResult> GetOrdersCount()
        {
            var count = await _context.Orders.CountAsync();
            return Ok(new { ordersCount = count });
        }

        [HttpGet("users/count")]
        public async Task<IActionResult> GetUsersCount()
        {
            var count = await _context.Users.CountAsync();
            return Ok(new { usersCount = count });
        }
        [HttpPut("orders/{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] OrderStatusDto dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            if (!Enum.TryParse<OrderStatus>(dto.Status, true, out var newStatus))
                return BadRequest("Invalid order status");

            var current = order.Status;

            if (current == OrderStatus.Delivered || current == OrderStatus.Cancelled)
                return BadRequest("Cannot change status after completion or cancellation");

            if (current == OrderStatus.Pending && newStatus == OrderStatus.Pending)
                return BadRequest("Order is already pending");

            order.Status = newStatus;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Order status updated" });
        }

    }
}
