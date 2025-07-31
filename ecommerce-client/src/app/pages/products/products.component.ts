import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService, WishlistItem } from '../../services/wishlist.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule,RouterModule, FormsModule, NgxPaginationModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
   products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  loading = true;
  wishlistIds: number[] = [];
  page = 1;

  constructor(
    private productService: ProductService,
    private cartSvc: CartService,

     private wishlistSvc: WishlistService
  ) {}

  ngOnInit(): void {
 this.loadProductsAndWishlist();
  }

 loadProductsAndWishlist() {
    this.loading = true;

    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.wishlistSvc.getWishlist().subscribe((wishlistItems: WishlistItem[]) => {
          this.wishlistIds = wishlistItems.map(i => i.productId);

          this.products = products.map(p => ({
            ...p,
            isFavorite: this.wishlistIds.includes(p.id)
          }));

          this.categories = [
            ...new Set(
              this.products
                .map(p => p.categoryName)
                .filter((name): name is string => typeof name === 'string')
            )
          ];

          this.filteredProducts = [...this.products];
          this.loading = false;
        });
      },
      error: () => {
        console.error('Failed to load products');
        this.loading = false;
      }
    });
  }

  filterByCategory() {
    this.page = 1;
  if (this.selectedCategory === '') {
    this.filteredProducts = this.products;
  } else {
    this.filteredProducts = this.products.filter(p => p.categoryName === this.selectedCategory);
  }
}


   isInWishlist(productId: number): boolean {
    return this.wishlistIds.includes(productId);
  }

 toggleFavorite(product: Product): void {
    if (this.isInWishlist(product.id)) {
      this.wishlistSvc.removeFromWishlist(product.id).subscribe(() => {
        this.wishlistIds = this.wishlistIds.filter(id => id !== product.id);
        product.isFavorite = false;
        this.wishlistSvc.refreshWishlistCount();
      });
    } else {
      this.wishlistSvc.addToWishlist(product.id).subscribe({
        next: () => {
          this.wishlistIds.push(product.id);
          product.isFavorite = true;
          this.wishlistSvc.refreshWishlistCount();
        },
        error: (err) => {
          if (err.status === 409) {
            if (!this.wishlistIds.includes(product.id)) {
              this.wishlistIds.push(product.id);
            }
            product.isFavorite = true;
            this.wishlistSvc.refreshWishlistCount();
          } else {
            console.error('Failed to add to wishlist:', err);
          }
        }
      });
    }
  }
 addToCart(productId: number) {
    this.cartSvc.addToCart(productId, 1).subscribe({
      next: () => {
        alert('Product added to cart!');
        this.wishlistSvc.refreshWishlistCount(); // ✅ عدلناها عشان تشيل userId
        this.cartSvc.refreshCartCount();
      },
      error: err => alert('Failed to add: ' + err.error)
    });
  }


}
