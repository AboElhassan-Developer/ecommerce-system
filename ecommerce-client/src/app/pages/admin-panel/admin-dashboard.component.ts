import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { StatisticsService } from '../../services/statistics.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  revenue: number = 0;
  ordersCount: number = 0;
  usersCount: number = 0;
  loading: boolean = true;

  constructor(private statsService: StatisticsService) {}

  ngOnInit(): void {
    forkJoin({
      revenue: this.statsService.getRevenue(),
      orders: this.statsService.getOrdersCount(),
      users: this.statsService.getUsersCount()
    }).subscribe({
      next: ({ revenue, orders, users }) => {
        this.revenue = revenue.revenue;
        this.ordersCount = orders.ordersCount;
        this.usersCount = users.usersCount;
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load dashboard stats', err);
        this.loading = false;
      }
    });
  }
}
