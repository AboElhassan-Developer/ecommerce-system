import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = 'http://localhost:4372/api/Cart';
 private cartCount$ = new BehaviorSubject<number>(0);
  constructor(private http: HttpClient) {}

  getCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.baseUrl);
  }

  addToCart(productId: number, quantity: number): Observable<any> {
    return this.http.post(this.baseUrl, { productId, quantity });
  }

  updateCartItem(id: number, quantity: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, quantity);
  }

  removeItem(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
    refreshCartCount(): void {
    this.getCart().subscribe(items => {
      const total = items.reduce((sum, item) => sum + item.quantity, 0);
      this.cartCount$.next(total);
    });
  }
   getCartCount(): Observable<number> {
    return this.cartCount$.asObservable();
  }
}
