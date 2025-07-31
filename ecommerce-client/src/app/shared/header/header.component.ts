import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isAdmin = false;
  isCustomer = false;
  cartCount = 0;
  userName: string | null = null;
  isDarkMode = false;

  private subscriptions: Subscription[] = [];
wishlistCount = 0;
  constructor(
    private auth: AuthService,
    private router: Router,
    private cartSvc: CartService,
    private wishlistSvc: WishlistService
  ) {}

  ngOnInit(): void {
    // اشتراك في بيانات المستخدم
    this.subscriptions.push(
      this.auth.isLoggedIn$.subscribe(status => {
        this.isLoggedIn = status;
        this.checkRole();
        this.setupCart();
      }),
      this.auth.role$.subscribe(() => this.checkRole()),
      this.auth.name$.subscribe(name => this.userName = name)
    );
 const userId = localStorage.getItem('userId') ?? '1';
this.wishlistSvc.refreshWishlistCount();
  this.subscriptions.push(
    this.wishlistSvc.getWishlistCount().subscribe(count => {
      this.wishlistCount = count;
    })
  );
    // تحميل الوضع من التخزين المحلي
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    const body = document.body;
    if (this.isDarkMode) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }

  private checkRole(): void {
    this.isAdmin = this.auth.isAdmin();
    this.isCustomer = this.auth.isCustomer();
  }

  private setupCart(): void {
    if (this.isLoggedIn && this.isCustomer) {
      this.cartSvc.getCartCount().subscribe(count => {
        this.cartCount = count;
      });
      this.cartSvc.refreshCartCount();
    } else {
      this.cartCount = 0;
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
