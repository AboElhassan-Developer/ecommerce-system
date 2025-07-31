import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image?: string;
  categoryId: number | null;
  categoryName?: string;
  isFavorite?: boolean;
}

@Injectable({ providedIn: 'root' })

export class ProductService {
  private baseUrl = 'http://localhost:4372/api/Products';
constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }
  getProductsByCategory(categoryId: number): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.baseUrl}/category/${categoryId}`);
}


  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  createProduct(formData: FormData): Observable<any> {
    return this.http.post(this.baseUrl, formData);
  }

  updateProduct(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, formData);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  getProductById(id: number) {
  return this.http.get<Product>(`${this.baseUrl}/${id}`);
}

}
