import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Category, CategoriesService } from '../services/categories.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-add-product',
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {
  product: any = {};
  categories: Category[] = [];
  selectedImage: File | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoriesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe((cats) => {
      this.categories = cats;
    });
  }

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

cancel() {
  this.router.navigate(['/admin/products']);
}


  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price.toString());
    formData.append('quantity', this.product.quantity.toString());
    formData.append('categoryId', this.product.categoryId.toString());

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.productService.createProduct(formData).subscribe({
      next: () => {
        alert('✅ Product added successfully!');
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        alert('❌ Failed to add product: ' + err.error);
      }
    });
  }
}
