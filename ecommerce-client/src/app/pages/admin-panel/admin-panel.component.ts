import { Product, ProductService } from '../../services/product.service';
import { CategoriesService, Category } from '../../services/categories.service';
import { Order, OrdersService } from '../../services/orders.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-admin-panel',
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  orders: Order[] = [];
selectedCategoryId: number = 0;
allProducts: Product[] = [];

  constructor(
    private prodSvc: ProductService,
    private catSvc: CategoriesService,
    private router: Router,
    private ordSvc: OrdersService
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll() {
  this.prodSvc.getAllProducts().subscribe(p => {
    this.allProducts = p;
    this.products = p;
  });
  this.catSvc.getAllCategories().subscribe(c => this.categories = c);
  this.ordSvc.getOrdersAdmin().subscribe(o => this.orders = o);
}

  filterProducts() {
  if (this.selectedCategoryId === 0) {
    this.prodSvc.getAllProducts().subscribe(p => this.products = p);
  } else {
    this.prodSvc.getProductsByCategory(this.selectedCategoryId).subscribe(p => this.products = p);
  }
}

 addProduct() {
  this.router.navigate(['/admin/products/add']);
}
editProduct(id: number) {
  this.router.navigate(['/admin/products/edit', id]);
}

deleteProduct(id: number) {
  if (confirm('Are you sure you want to delete this product?')) {
    this.prodSvc.deleteProduct(id).subscribe(() => {

      this.products = this.products.filter(p => p.id !== id);
    });
  }
}

addCategory() {
  console.log('Add Category clicked');
}
}
