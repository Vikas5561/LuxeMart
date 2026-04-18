import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order-confirmation',
  template: `
    <div class="confirmation-container">
      <div class="confirmation-card fade-in">
        <div class="success-icon-wrapper">
          <div class="success-icon">✓</div>
        </div>
        
        <h1>Order Confirmed!</h1>
        <p class="confirmation-text">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
        
        <div class="order-details-card" *ngIf="order">
          <div class="order-header">
            <span class="order-label">Order ID</span>
            <span class="order-id">#{{ order.orderId }}</span>
          </div>
          
          <div class="order-divider"></div>
          
          <div class="order-row">
            <span>Date</span>
            <span>{{ getOrderDate() }}</span>
          </div>
          
          <div class="order-row">
            <span>Payment Method</span>
            <span>{{ order.paymentMethod || 'Online Payment' }}</span>
          </div>
          
          <div class="order-row">
            <span>Expected Delivery</span>
            <span class="delivery-date">{{ getDeliveryDate() }}</span>
          </div>
          
          <div class="order-divider"></div>
          
          <div class="order-total-row">
            <span>Total Amount</span>
            <span class="total-price">₹{{ order.totalAmount || order.totalPrice }}</span>
          </div>
        </div>

        <button class="btn btn-outline-primary mb-3 full-width" (click)="downloadInvoice()">
            📄 Download Invoice Again
        </button>

        <div class="action-buttons">
          <button routerLink="/customer/orders" class="btn btn-secondary btn-block">Track Order</button>
          <button routerLink="/products" class="btn btn-primary btn-block">Continue Shopping</button>
        </div>
        
        <p class="email-notice">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-container {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background-color: var(--bg-secondary);
    }

    .confirmation-card {
      background: white;
      border-radius: 24px;
      padding: 3rem 2rem;
      max-width: 500px;
      width: 100%;
      text-align: center;
      box-shadow: var(--shadow-xl);
      border: 1px solid var(--border-color);
    }

    .success-icon-wrapper {
      width: 80px;
      height: 80px;
      background: #d1fae5; /* Green 100 */
      color: #059669; /* Green 600 */
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }

    .success-icon {
      font-size: 3rem;
      line-height: 1;
      font-weight: 700;
    }

    h1 {
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      font-size: 1.75rem;
    }

    .confirmation-text {
      color: var(--text-secondary);
      margin-bottom: 2rem;
    }

    .order-details-card {
      background: var(--bg-secondary);
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      text-align: left;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .order-label {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .order-id {
      font-weight: 700;
      color: var(--primary-color);
      font-size: 1.1rem;
    }

    .order-divider {
      height: 1px;
      background-color: var(--border-color);
      margin: 1rem 0;
    }

    .order-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      font-size: 0.95rem;
      color: var(--text-secondary);
    }

    .order-row span:last-child {
      color: var(--text-primary);
      font-weight: 500;
    }
    
    .delivery-date {
      color: var(--success-color) !important;
      font-weight: 600 !important;
    }

    .order-total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--text-primary);
    }

    .total-price {
      color: var(--primary-color);
      font-size: 1.25rem;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .btn-block {
      flex: 1;
    }

    .email-notice {
      font-size: 0.85rem;
      color: var(--text-light);
      margin: 0;
    }
    
    @media (max-width: 480px) {
      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class OrderConfirmationComponent implements OnInit {
  order: any = null;
  orderId: number = 0;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.orderId = navigation.extras.state['orderId'];
    }
  }

  ngOnInit() {
    if (!this.orderId) {
      this.router.navigate(['/']);
      return;
    }
    this.loadOrder();
  }

  loadOrder() {
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        // Auto-download invoice as requested
        setTimeout(() => this.downloadInvoice(), 1000);
      },
      error: (err) => console.error('Error loading order:', err)
    });
  }

  getOrderDate(): string {
    if (!this.order?.orderDate) return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    return new Date(this.order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  getDeliveryDate(): string {
    if (this.order?.deliveryDate) {
      return new Date(this.order.deliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    // Fallback if no delivery date set (calculate expected)
    const date = this.order?.orderDate ? new Date(this.order.orderDate) : new Date();
    date.setDate(date.getDate() + 4);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  downloadInvoice() {
    if (!this.orderId) return;

    this.orderService.downloadInvoice(this.orderId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Invoice_${this.orderId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Error downloading invoice:', err)
    });
  }
}


