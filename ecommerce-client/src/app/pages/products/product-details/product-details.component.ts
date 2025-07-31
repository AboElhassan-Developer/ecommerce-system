import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Product, ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule,RouterModule, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  productId!: number;
  product!: Product;
  loading = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}
addToCart(): void {
  this.cartService.addToCart(this.product.id, 1).subscribe({
    next: () => {
      alert('Product added to cart!');
      this.cartService.refreshCartCount(); // تحديث العداد بعد الإضافة
    },
    error: () => {
      alert('Failed to add product to cart.');
    }
  });
}

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(this.productId).subscribe({
      next: (prod) => {
        this.product = prod;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load product.';
        this.loading = false;
      }
    });

  }
}
