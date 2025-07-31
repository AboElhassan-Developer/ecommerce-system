import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Order, OrdersService } from '../../services/orders.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

enum OrderStatus {
  Pending = 0,
  Processing = 1,
  Shipped = 2,
  Delivered = 3,
  Cancelled = 4
}

@Component({
  selector: 'app-orders',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  public OrderStatus = OrderStatus;

  orders: Order[] = [];
  loading = true;
  error = '';
  orderStatusKeys: number[] = [];

  OrderStatusLabel: { [key: number]: string } = {
    0: 'Pending',
    1: 'Processing',
    2: 'Shipped',
    3: 'Delivered',
    4: 'Cancelled'
  };

  constructor(private ordersSvc: OrdersService) {}

  ngOnInit(): void {
    this.orderStatusKeys = Object.keys(this.OrderStatusLabel).map(k => parseInt(k));

    this.ordersSvc.getUserOrders().subscribe({
      next: data => {
        this.orders = data;
        this.loading = false;
      },
      error: () => {
  this.error = 'Failed to load your orders';
  this.loading = false;
}

    });
  }

  onStatusChange(event: Event, orderId: number) {
  const value = (event.target as HTMLSelectElement).value;
  this.updateStatus(orderId, parseInt(value));
}
cancelOrder(orderId: number) {
  if (confirm('Are you sure you want to cancel this order?')) {
    this.ordersSvc.cancelOrder(orderId).subscribe({
      next: () => {
        alert('Order cancelled.');
        // تحدث القائمة بعد الإلغاء
        this.orders = this.orders.map(o =>
          o.id === orderId ? { ...o, status: OrderStatus.Cancelled } : o
        );
      },
      error: () => {
        alert('Failed to cancel the order.');
      }
    });
  }
}


  updateStatus(orderId: number, newStatus: number) {
    const statusText = this.OrderStatusLabel[newStatus];
    this.ordersSvc.updateOrderStatus(orderId, statusText).subscribe({
      next: () => {
        const order = this.orders.find(o => o.id === orderId);
        if (order) order.status = newStatus;
      },
      error: () => {
        alert('Failed to update order status');
      }
    });
  }
}
