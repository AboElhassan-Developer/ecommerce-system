import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface WishlistItem {
  id?: number;
  userId: string;
  productId: number;
  productName?: string;
  productImage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = 'http://localhost:4372/api/Wishlist';

  private wishlistCount = new BehaviorSubject<number>(0);
  wishlistCount$ = this.wishlistCount.asObservable();
getWishlistCount(): Observable<number> {
  return this.wishlistCount.asObservable();
}
  constructor(private http: HttpClient) {}

  getWishlist(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(this.apiUrl);
  }

  addToWishlist(productId: number): Observable<any> {
  const body = { productId }; // فقط المنتج
  return this.http.post(this.apiUrl, body);
}

removeFromWishlist(productId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${productId}`);
}


  refreshWishlistCount(): void {
    this.getWishlist().subscribe(items => {
      this.wishlistCount.next(items.length);
    });
  }
}
