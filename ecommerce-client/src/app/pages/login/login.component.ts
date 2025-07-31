import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule,RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error: string = '';
showPassword = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
submit() {
  if (this.form.invalid) return;

  this.loading = true;
  this.error = '';

  this.auth.login(this.form.value).subscribe({
    next: (res: any) => {
      localStorage.setItem('token', res.token);
      this.loading = false;
      const tokenParts = res.token.split('.');
      if (tokenParts.length !== 3) {
        this.error = 'Invalid token format.';
        return;
      }
 const payload = JSON.parse(atob(tokenParts[1]));
 console.log('Payload:', payload);
 localStorage.setItem('userData', JSON.stringify({
  name: res.user?.fullName || payload["name"],
  email: res.user?.email || payload["email"],
role: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload["role"]
}));

   const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role;
console.log('Role:', role);



    if (role?.toLowerCase() === 'admin') {
  this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/products']);
      }
    },
    error: err => {
      console.error(err);
      this.loading = false;
      this.error = err.error?.message || 'Login failed. Please try again.';
    }
  });
}



}
