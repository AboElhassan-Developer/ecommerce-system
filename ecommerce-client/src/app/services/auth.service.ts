import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface UserData {
  name: string;
  email: string;
  role: string;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:4372/api/auth';

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  private roleSubject = new BehaviorSubject<string | null>(this.getRole());
  role$ = this.roleSubject.asObservable();

  private nameSubject = new BehaviorSubject<string | null>(this.getUserName());
  name$ = this.nameSubject.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private decodeToken(): any | null {
    const token = localStorage.getItem('token');
    return token ? jwtDecode(token) : null;
  }

  private getRole(): string | null {
    const decoded = this.decodeToken();
    return decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded?.role || null;
  }

  private getUserName(): string | null {
    const decoded = this.decodeToken();
    return decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded?.name || null;
  }

  getUserData(): UserData | null {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  }

  isAdmin(): boolean {
    return this.getRole()?.toLowerCase() === 'admin';
  }

  isCustomer(): boolean {
    return this.getRole()?.toLowerCase() === 'customer';
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((response: any) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('token', token);
          const decoded: any = jwtDecode(token);

          const name =
            decoded['name'] ||
            decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
            decoded['given_name'] ||
            'Unknown';

          const email =
            decoded['email'] ||
            decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];

          const role =
            decoded['role'] ||
            decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

          const userId = decoded.sub || decoded['userId'];

          localStorage.setItem('userData', JSON.stringify({ name, email, role, userId }));
          this.loggedIn.next(true);
          this.roleSubject.next(role);
          this.nameSubject.next(name);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    this.loggedIn.next(false);
    this.roleSubject.next(null);
    this.nameSubject.next(null);
  }

  register(data: { fullName: string; email: string; password: string; role?: string }) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  updateProfile(data: { name: string; email: string }) {
    return this.http.put(`${this.baseUrl}/update-profile`, data);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
