import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface OrderItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
}

export interface Order {
  id: number;
  status: number;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[]; 
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private baseUrl = 'http://localhost:4372/api';

  constructor(private http: HttpClient) {}

 getUserOrders(): Observable<Order[]> {
  return this.http.get<Order[]>(`${this.baseUrl}/Orders`);
}


 getOrdersAdmin(): Observable<Order[]> {
  return this.http.get<Order[]>(`${this.baseUrl}/admin/orders`);
}
 cancelOrder(id: number): Observable<any> {
return this.http.delete(`${this.baseUrl}/orders/${id}`);
  }

  updateOrderStatus(orderId: number, statusText: string) {
  return this.http.put(
    `${this.baseUrl}/admin/orders/${orderId}/status`,
     { status: statusText },
    { headers: { 'Content-Type': 'application/json' } }
  );
}
}



