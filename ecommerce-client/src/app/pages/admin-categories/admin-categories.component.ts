import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Category, CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css',
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];
  formData = {
    name: '',
  };
  editingId: number | null = null;
  loading = false;
  error = '';
  success = '';

  constructor(private catSvc: CategoriesService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.catSvc.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => {
        this.error = '❌ Failed to load categories';
        this.loading = false;
      },
    });
  }

  save() {
    const trimmedName = this.formData.name.trim();
    if (!trimmedName) return;

    const request = this.editingId
      ? this.catSvc.updateCategory(this.editingId, { name: trimmedName })
      : this.catSvc.addCategory({ name: trimmedName });

    request.subscribe({
      next: () => {
        this.success = this.editingId ? '✅ Category updated' : '✅ Category added';
        this.loadCategories();
        this.reset();
        setTimeout(() => (this.success = ''), 3000);
      },
      error: () => {
        this.error = '❌ Failed to save category';
        setTimeout(() => (this.error = ''), 3000);
      },
    });
  }

  edit(cat: Category) {
    this.editingId = cat.id;
    this.formData.name = cat.name;
  }

  delete(id: number) {
    if (!confirm('Are you sure you want to delete this category?')) return;

    this.catSvc.deleteCategory(id).subscribe({
      next: () => {
        this.categories = this.categories.filter((c) => c.id !== id);
        this.success = '🗑️ Category deleted';
        setTimeout(() => (this.success = ''), 3000);
      },
      error: () => {
        this.error = '❌ Failed to delete category';
        setTimeout(() => (this.error = ''), 3000);
      },
    });
  }

  reset() {
    this.formData.name = '';
    this.editingId = null;
  }
}
