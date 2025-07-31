import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule, HttpClientModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  loading = false;
  message = '';

  constructor(private http: HttpClient, private cartSvc: CartService) {}

  checkout() {
    this.loading = true;
    this.http.post('http://localhost:4372/api/orders/from-cart', {}).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Order placed successfully!';
        this.cartSvc.getCart().subscribe();
      },
      error: err => {
        this.loading = false;
        this.message = 'Checkout failed: ' + (err.error?.message || err.statusText);
      }
    });
  }
}
