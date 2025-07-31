import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = 'http://localhost:4372/api/admin/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  updateRole(id: string, role: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/role`, { role });
  }
}
