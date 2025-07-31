import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private baseUrl = 'http://localhost:4372/api/admin';

  constructor(private http: HttpClient) {}

  getRevenue(): Observable<{ revenue: number }> {
    return this.http.get<{ revenue: number }>(`${this.baseUrl}/revenue`);
  }

  getOrdersCount(): Observable<{ ordersCount: number }> {
    return this.http.get<{ ordersCount: number }>(`${this.baseUrl}/orders/count`);
  }

  getUsersCount(): Observable<{ usersCount: number }> {
    return this.http.get<{ usersCount: number }>(`${this.baseUrl}/users/count`);
  }
}

