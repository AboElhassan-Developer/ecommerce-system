import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { CartComponent } from './pages/cart/cart.component';
import { AuthGuard } from './guards/auth.guard';
import { CheckoutComponent } from './pages/checkout/checkout.component';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { HomeRedirectComponent } from './pages/home-redirect.component';
import { AddProductComponent } from './admin/add-product.component';
import { EditProductComponent } from './admin/edit-product.component';
import { AdminDashboardComponent } from './pages/admin-panel/admin-dashboard.component';
import { AdminOrdersComponent } from './pages/admin-orders/admin-orders.component';
import { AdminCategoriesComponent } from './pages/admin-categories/admin-categories.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProductDetailsComponent } from './pages/products/product-details/product-details.component';
export const routes: Routes = [
{ path: '', redirectTo: 'login', pathMatch: 'full' },
 // Auth
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // User pages (protected)
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
{ path: 'product/:id', component: ProductDetailsComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  // Admin pages (protected)
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard, AdminGuard] },
{ path: 'admin/products', component: AdminPanelComponent, canActivate: [AuthGuard, AdminGuard] },
{ path: 'admin/products/add', component: AddProductComponent, canActivate: [AuthGuard, AdminGuard] },
{ path: 'admin/products/edit/:id', component: EditProductComponent, canActivate: [AuthGuard, AdminGuard] },
{ path: 'admin/categories', component: AdminCategoriesComponent, canActivate: [AuthGuard, AdminGuard] },
{ path: 'admin/users', component: AdminUsersComponent, canActivate: [AuthGuard, AdminGuard] },
{ path: 'admin/orders', component: AdminOrdersComponent, canActivate: [AuthGuard, AdminGuard] }, // ✅ للأدمن


  // Fallback
  { path: '**', redirectTo: '' },

];
