import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Order, OrdersService } from '../../services/orders.service';

enum OrderStatus {
  Pending = 0,
  Processing = 1,
  Shipped = 2,
  Delivered = 3,
  Cancelled = 4
}

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {
  public OrderStatus = OrderStatus;

  OrderStatusLabel: { [key: number]: string } = {
    0: 'Pending',
    1: 'Processing',
    2: 'Shipped',
    3: 'Delivered',
    4: 'Cancelled'
  };

  orders: Order[] = [];
  loading = true;
  error = '';
  orderStatusKeys: number[] = [];

  constructor(private orderSvc: OrdersService) {}

  ngOnInit(): void {
    this.orderStatusKeys = Object.keys(this.OrderStatusLabel).map(k => parseInt(k));

    this.orderSvc.getOrdersAdmin().subscribe({
      next: data => {
        this.orders = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load admin orders';
        this.loading = false;
      }
    });
  }

  onStatusChange(event: Event, orderId: number) {
    const value = (event.target as HTMLSelectElement).value;
    this.updateStatus(orderId, parseInt(value));
  }

  updateStatus(orderId: number, newStatus: number) {
    const statusText = this.OrderStatusLabel[newStatus];
    this.orderSvc.updateOrderStatus(orderId, statusText).subscribe({
      next: () => {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
          order.status = newStatus;
        }
      },
      error: () => {
        alert('Failed to update order status');
      }
    });
  }

  getAvailableStatusOptions(currentStatus: number): number[] {
    switch (currentStatus) {
      case OrderStatus.Pending:
        return [OrderStatus.Processing, OrderStatus.Cancelled];
      case OrderStatus.Processing:
        return [OrderStatus.Shipped, OrderStatus.Cancelled];
      case OrderStatus.Shipped:
        return [OrderStatus.Delivered];
      default:
        return [];
    }
  }
}
