using ECommerceSystem.DTOs;
using ECommerceSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;

namespace ECommerceSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistController : ControllerBase
    {
        private readonly ECommerceDbContext _context;

        public WishlistController(ECommerceDbContext context)
        {
            _context = context;
        }


        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetWishlist()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var wishlist = await _context.WishlistItems
                .Include(w => w.Product)
                .Where(w => w.UserId == userId)
                .Select(w => new WishlistItemDto
                {
                    Id = w.Id,
                    UserId = w.UserId,
                    ProductId = w.ProductId,
                    ProductName = w.Product.Name,
                    ProductImage = w.Product.Image
                })
                .ToListAsync();

            return Ok(wishlist);
        }


        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddToWishlist([FromBody] WishlistItemDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var product = await _context.Products.FindAsync(dto.ProductId);
            if (product == null)
                return BadRequest("Invalid product ID");

            var exists = await _context.WishlistItems
                .AnyAsync(w => w.UserId == userId && w.ProductId == dto.ProductId);
            if (exists)
                return BadRequest("Product already in wishlist");

            var wishlistItem = new WishlistItem
            {
                ProductId = dto.ProductId,
                UserId = userId
            };

            _context.WishlistItems.Add(wishlistItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Added to wishlist" });
        }


        [Authorize]
        [HttpDelete("{productId}")]
        public async Task<IActionResult> RemoveFromWishlist(int productId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var item = await _context.WishlistItems
                .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);

            if (item == null)
                return NotFound();

            _context.WishlistItems.Remove(item);
            await _context.SaveChangesAsync();

            return Ok();
        }

    }
}