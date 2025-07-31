import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartItem, CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  loading = true;

  constructor(private cartSvc: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartSvc.getCart().subscribe({
      next: (res) => {
        this.items = res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

 updateQuantity(item: CartItem) {
  if (item.quantity < 1) {
    item.quantity = 1;
  }

  this.cartSvc.updateCartItem(item.id, item.quantity).subscribe({
    next: () => {
      item.total = item.price * item.quantity;
      this.cartSvc.refreshCartCount(); // تحديث مباشر
    },
    error: () => alert('❌ Failed to update item'),
  });
}

trackById(index: number, item: CartItem) {
  return item.id;
}

 remove(item: CartItem) {
  if (!confirm(`Are you sure you want to remove "${item.productName}" from cart?`)) return;

  this.cartSvc.removeItem(item.id).subscribe(() => {
    this.loadCart();
    this.cartSvc.refreshCartCount();
  });
}



  get grandTotal(): number {
    return this.items.reduce((sum, x) => sum + x.total, 0);
  }
}
