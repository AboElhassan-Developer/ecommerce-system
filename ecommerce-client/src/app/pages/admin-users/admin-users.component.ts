import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { User, UsersService } from '../../services/users.service';

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})

export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  loading = true;
  error = '';

  constructor(private usersSvc: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.usersSvc.getAllUsers().subscribe({
      next: data => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load users';
        this.loading = false;
      }
    });
  }

  deleteUser(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    this.usersSvc.deleteUser(id).subscribe({
      next: () => this.users = this.users.filter(u => u.id !== id),
      error: () => alert('Failed to delete user')
    });
  }

  toggleRole(user: User) {
    const newRole = user.role === 'Admin' ? 'Customer' : 'Admin';
    this.usersSvc.updateRole(user.id, newRole).subscribe({
      next: () => {
        user.role = newRole;
      },
      error: () => alert('Failed to update role')
    });
  }
}




























































































































































