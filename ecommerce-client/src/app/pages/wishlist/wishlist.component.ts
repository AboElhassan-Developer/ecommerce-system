import { Component, OnInit } from '@angular/core';
import { WishlistService, WishlistItem } from '../../services/wishlist.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist: WishlistItem[] = [];
  loading = false;
  error = '';
  loadingMessage = 'Loading...';
  emptyMessage = 'No items in your wishlist.';

  constructor(private wishlistSvc: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }
addToCart(productId: number): void {
  const quantity = 1;
  this.cartService.addToCart(productId, quantity).subscribe({
    next: () => {
      this.cartService.refreshCartCount();
      this.remove(productId); // ← remove from wishlist
      alert('Added to cart and removed from wishlist!');
    },
    error: () => alert('Failed to add to cart.')
  });
}


  loadWishlist(): void {
    this.loading = true;
    this.wishlistSvc.getWishlist().subscribe({
      next: (items) => {
        this.wishlist = items;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load wishlist';
        this.loading = false;
      }
    });
  }

  remove(productId: number): void {
    this.wishlistSvc.removeFromWishlist(productId).subscribe({
      next: () => {
        this.wishlist = this.wishlist.filter(item => item.productId !== productId);
        this.wishlistSvc.refreshWishlistCount();
        alert('Item removed from wishlist!');
      },
      error: () => {
        alert('Failed to remove item.');
      }
    });
  }
}
