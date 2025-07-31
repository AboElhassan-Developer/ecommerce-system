import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Category, CategoriesService } from '../services/categories.service';
import { Product, ProductService } from '../services/product.service';

@Component({
  selector: 'app-edit-product',
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {
  product: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    categoryId: null,
    image: ''
  };
  categories: Category[] = [];
  selectedImage: File | null = null;
  id: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct();
    this.categoryService.getAllCategories().subscribe(c => this.categories = c);
  }

  loadProduct() {
  this.productService.getProduct(this.id).subscribe({
    next: p => {
      this.product = p;
      this.product.categoryId = p.categoryId && p.categoryId > 0 ? p.categoryId : null;
    },
    error: err => {
      alert('Failed to load product');
      this.router.navigate(['/admin/products']);
    }
  });
}



  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  onSubmit() {
  const formData = new FormData();
  formData.append('id', this.product.id.toString());
  formData.append('name', this.product.name);
  formData.append('description', this.product.description);
  formData.append('price', this.product.price.toString());
  formData.append('quantity', this.product.quantity.toString());

  // ✅ تأكد من أن CategoryId صالح
  if (this.product.categoryId && this.product.categoryId > 0) {
    formData.append('categoryId', this.product.categoryId.toString());
  } else {
    alert("❌ Please select a valid category.");
    return;
  }

  if (this.selectedImage !== null) {
    formData.append('image', this.selectedImage);
  }

  console.log([...formData.entries()]);

  this.productService.updateProduct(this.product.id, formData).subscribe({
    next: () => {
      alert('✅ Product updated successfully');
      this.router.navigate(['/admin/products']);
    },
    error: err => {
      console.error("Validation Errors: ", err.error);
      alert('❌ Failed to update:\n' + JSON.stringify(err.error, null, 2));
    }
  });
}

  deleteProduct() {
    const confirmDelete = confirm('Are you sure you want to delete this product?');

    if (confirmDelete) {
      this.productService.deleteProduct(this.product.id).subscribe({
        next: () => {
          alert('🗑️ Product deleted successfully.');
          this.router.navigate(['/admin/products']);
        },
        error: err => {
          alert('❌ Failed to delete product: ' + err.error);
        }
      });
    }
  }
}
