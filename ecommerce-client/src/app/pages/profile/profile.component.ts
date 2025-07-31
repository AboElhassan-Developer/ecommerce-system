import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-profile',
    imports: [CommonModule,FormsModule,RouterModule, ReactiveFormsModule, HttpClientModule],

  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  form!: FormGroup;
  userData: any;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userData = this.authService.getUserData();
    if (!this.userData) {
      this.router.navigate(['/login']);
      return;
    }

    this.form = this.fb.group({
      name: [this.userData.name, Validators.required],
      email: [this.userData.email, [Validators.required, Validators.email]],
      role: [{ value: this.userData.role, disabled: true }]
    });
  }

  saveChanges() {
    const updatedData = this.form.getRawValue();

    this.authService.updateProfile(updatedData).subscribe({
      next: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        alert('Profile updated successfully! Please login again.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Update failed', err);
        alert('Something went wrong while updating your profile.');
      }
    });
  }
}
