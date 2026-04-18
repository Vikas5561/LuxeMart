import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { FeedbackService } from '../../core/services/feedback.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-order-history',
  template: `
    <div class="orders-container">
      <div class="header-section fade-in">
        <h1>My Orders</h1>
        <p class="subtitle">Track and manage your recent purchases</p>
      </div>
      
      <div *ngIf="orders.length > 0; else emptyState" class="orders-grid fade-in">
        <div *ngFor="let order of orders" class="order-card">
          <div class="order-header">
            <div class="order-id-group">
              <span class="order-icon">📦</span>
              <div>
                <h3>Order #{{ order.orderId }}</h3>
                <p class="order-date">{{ order.orderDate | date:'MMM d, y' }}</p>
              </div>
            </div>
            <div class="status-badge" [ngClass]="order.status.toLowerCase()">
              {{ order.status }}
            </div>
          </div>

          <div class="order-items">
            <div *ngFor="let item of order.items.slice(0, 2)" class="order-item">
              <div class="item-image">
                <img [src]="item.product.imageUrl" [alt]="item.product.name">
              </div>
              <div class="item-details">
                <h4>{{ item.product.name }}</h4>
                <p class="item-meta">Qty: {{ item.quantity }}</p>
              </div>
            </div>
            <div *ngIf="order.items.length > 2" class="more-items">
              +{{ order.items.length - 2 }} more items
            </div>
          </div>

          <div class="order-footer">
            <p class="order-total">Total: ₹{{ order.totalAmount | number:'1.2-2' }}</p>
            <div class="order-actions">
              <!-- Cancel Order (Only if PLACED or CONFIRMED) -->
              <button *ngIf="order.status === 'PLACED' || order.status === 'CONFIRMED'" 
                      (click)="cancelOrder(order.orderId)" 
                      class="btn btn-danger-outline btn-sm">
                Cancel
              </button>

              <!-- Track Order (If NOT Delivered) -->
              <button *ngIf="order.status !== 'DELIVERED' && order.status !== 'CANCELLED'" 
                      (click)="trackOrder(order)" 
                      class="btn btn-primary btn-sm">
                Track
              </button>

              <!-- Leave Feedback (If DELIVERED) -->
              <button *ngIf="order.status === 'DELIVERED'" 
                      (click)="openFeedback(order)" 
                      class="btn btn-secondary btn-sm">
                Feedback
              </button>
            </div>
          </div>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="empty-state fade-in">
          <div class="empty-icon">🛍️</div>
          <h2>No orders yet</h2>
          <p>Start shopping to see your orders here</p>
          <a routerLink="/customer/home" class="btn btn-primary btn-lg mt-3">
            Start Shopping
          </a>
        </div>
      </ng-template>

      <!-- Track Order Modal -->
      <div *ngIf="showTrackingModal" class="modal-overlay fade-in" (click)="closeTracking()">
        <div class="modal-content slide-up" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <h2>Track Order #{{ selectedOrder?.orderId }}</h2>
              <p class="modal-subtitle">Estimated Delivery: {{ trackingInfo?.deliveryDate | date:'mediumDate' }}</p>
            </div>
            <button class="btn-close" (click)="closeTracking()">×</button>
          </div>
          
          <div class="modal-body">
            <div class="tracking-timeline">
              <div class="timeline-item" [class.active]="isStatusActive('PLACED')">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h4>Order Placed</h4>
                  <p>{{ trackingInfo?.orderDate | date:'medium' }}</p>
                </div>
              </div>
              
              <div class="timeline-item" [class.active]="isStatusActive('CONFIRMED')">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h4>Order Confirmed</h4>
                  <p *ngIf="isStatusActive('CONFIRMED')">We've received your order</p>
                </div>
              </div>
              
              <div class="timeline-item" [class.active]="isStatusActive('SHIPPED')">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h4>Shipped</h4>
                  <p *ngIf="trackingInfo?.trackingNumber">Tracking: {{ trackingInfo?.trackingNumber }}</p>
                </div>
              </div>
              
              <div class="timeline-item" [class.active]="isStatusActive('DELIVERED')">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h4>Delivered</h4>
                  <p *ngIf="trackingInfo?.deliveryDate">{{ trackingInfo?.deliveryDate | date:'medium' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Feedback Modal -->
      <div *ngIf="showFeedbackModal" class="modal-overlay fade-in" (click)="closeFeedback()">
        <div class="modal-content slide-up" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Leave Feedback</h2>
            <button class="btn-close" (click)="closeFeedback()">×</button>
          </div>
          <div class="modal-body">
            <form [formGroup]="feedbackForm" (ngSubmit)="submitFeedback()">
              <div class="form-group">
                <label>Rating</label>
                <div class="rating-stars">
                  <span *ngFor="let star of stars; let i = index" 
                        (click)="setRating(i + 1)"
                        [class.filled]="i < feedbackForm.get('rating')?.value">
                    ★
                  </span>
                </div>
              </div>
              
              <div class="form-group">
                <label>Comments</label>
                <textarea formControlName="description" rows="4" class="form-textarea" placeholder="Share your experience..."></textarea>
              </div>

              <div class="modal-actions">
                <button type="button" class="btn btn-secondary" (click)="closeFeedback()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="feedbackForm.invalid || submittingFeedback">
                  {{ submittingFeedback ? 'Submitting...' : 'Submit Feedback' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .orders-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .header-section {
      margin-bottom: 2rem;
      text-align: center;
    }

    .header-section h1 {
      font-size: 2rem;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
    }

    /* Grid Layout for Horizontal Cards */
    .orders-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .order-card {
      background: white;
      border-radius: 16px;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .order-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-4px);
    }

    .order-header {
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--bg-secondary);
      border-radius: 16px 16px 0 0;
    }

    .order-id-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .order-icon {
      font-size: 1.25rem;
      background: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-sm);
    }

    .order-id-group h3 {
      margin: 0;
      font-size: 1rem;
      color: var(--text-primary);
    }

    .order-date {
      margin: 0;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .order-items {
      padding: 1rem;
      flex: 1; 
    }

    .order-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .item-image {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--border-color);
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-details h4 {
      margin: 0;
      font-size: 0.9rem;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 180px;
    }

    .item-meta {
      margin: 0;
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    .more-items {
      font-size: 0.85rem;
      color: var(--primary-color);
      text-align: center;
      margin-top: 0.5rem;
    }

    .order-footer {
      padding: 1rem;
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f9fafb;
      border-radius: 0 0 16px 16px;
    }

    .order-total {
      margin: 0;
      font-weight: 700;
      color: var(--text-primary);
      font-size: 1rem;
    }

    .order-actions {
      display: flex;
      gap: 0.5rem;
    }

    .status-badge {
      padding: 0.25rem 0.6rem;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-badge.placed { background: #e0e7ff; color: #4338ca; }
    .status-badge.confirmed { background: #dbeafe; color: #1e40af; }
    .status-badge.shipped { background: #fef3c7; color: #92400e; }
    .status-badge.delivered { background: #dcfce7; color: #166534; }
    .status-badge.cancelled { background: #fee2e2; color: #991b1b; }

    .btn-sm {
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
    }

    /* Rating Stars */
    .rating-stars {
      display: flex;
      gap: 0.25rem;
      font-size: 1.5rem;
      cursor: pointer;
      color: #d1d5db;
    }
    
    .rating-stars span.filled {
      color: #fbbf24;
    }

    .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      margin-top: 0.5rem;
      font-family: inherit;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1100;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4px);
    }
    
    .modal-content {
      background: white;
      border-radius: 20px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-xl);
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    
    .modal-body {
      padding: 1.5rem;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--text-secondary);
      cursor: pointer;
    }

    /* Timeline Styles */
    .tracking-timeline {
      position: relative;
      padding: 0 0 0 1.5rem;
      border-left: 2px solid var(--border-color);
      margin: 0.5rem 0;
    }
    .timeline-item {
      position: relative;
      margin-bottom: 2rem;
      opacity: 0.5;
    }
    .timeline-item.active { opacity: 1; }
    .timeline-marker {
      position: absolute;
      left: -1.95rem;
      top: 0;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: white;
      border: 3px solid var(--border-color);
    }
    .timeline-item.active .timeline-marker {
      border-color: var(--primary-color);
      background: var(--primary-color);
    }
    .timeline-content h4 { margin: 0 0 0.25rem; font-size: 0.95rem; }
    .timeline-content p { margin: 0; font-size: 0.8rem; color: var(--text-secondary); }
    
    /* Animations */
    .fade-in { animation: fadeIn 0.3s ease-out; }
    .slide-up { animation: slideUp 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  showTrackingModal: boolean = false;
  showFeedbackModal: boolean = false;
  selectedOrder: any = null;
  trackingInfo: any = null;
  feedbackForm: FormGroup;
  stars: number[] = [1, 2, 3, 4, 5];
  submittingFeedback: boolean = false;

  constructor(
    private orderService: OrderService,
    private feedbackService: FeedbackService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.feedbackForm = this.fb.group({
      rating: [5, Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getUserOrders().subscribe({
      next: (orders) => this.orders = orders,
      error: (err) => console.error('Error loading orders:', err)
    });
  }

  cancelOrder(orderId: number) {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          this.loadOrders();
        },
        error: (err) => {
          console.error('Error cancelling order:', err);
          const errorMessage = err.error?.message || err.statusText || 'Unknown error';
          alert(`Error cancelling order: ${errorMessage}`);
        }
      });
    }
  }

  // Tracking Logic
  trackOrder(order: any) {
    this.selectedOrder = order;
    this.showTrackingModal = true;

    // Initialize with current order info primarily
    this.trackingInfo = {
      orderId: order.orderId,
      status: order.status,
      orderDate: order.orderDate,
      deliveryDate: order.deliveryDate,
      // Default to empty strings if not present, will be updated by API
      trackingNumber: order.trackingNumber || '',
      paymentStatus: order.paymentStatus || 'PAID'
    };

    // Optionally fetch more details if endpoint provides it
    this.orderService.getOrderById(order.orderId).subscribe({
      next: (data) => {
        this.trackingInfo = data;
      },
      error: (err) => console.log('Using basic order info for tracking')
    });
  }

  closeTracking() {
    this.showTrackingModal = false;
    this.selectedOrder = null;
    this.trackingInfo = null;
  }

  isStatusActive(status: string): boolean {
    const statusOrder = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
    // Use optional chain/fallback in case trackingInfo is bare
    const currentStatus = this.trackingInfo?.status || this.selectedOrder?.status;
    const currentIndex = statusOrder.indexOf(currentStatus);
    const checkIndex = statusOrder.indexOf(status);
    return checkIndex <= currentIndex;
  }

  // Feedback Logic
  openFeedback(order: any) {
    this.selectedOrder = order;
    this.feedbackForm.reset({ rating: 5, description: '' });
    this.submittingFeedback = false;
    this.showFeedbackModal = true;
  }

  closeFeedback() {
    this.showFeedbackModal = false;
    this.selectedOrder = null;
  }

  setRating(rating: number) {
    this.feedbackForm.patchValue({ rating });
  }

  submitFeedback() {
    if (this.feedbackForm.invalid || !this.selectedOrder) return;

    this.submittingFeedback = true;

    try {
      const currentUser = this.authService.getCurrentUser();

      if (!currentUser) {
        alert('Please log in to submit feedback');
        this.submittingFeedback = false;
        return;
      }

      const feedbackData = {
        orderId: this.selectedOrder.orderId,
        customerId: currentUser.customerId || currentUser.userId?.toString(),
        customerName: (currentUser.firstName || '') + ' ' + (currentUser.lastName || ''),
        rating: this.feedbackForm.value.rating,
        description: this.feedbackForm.value.description
      };

      console.log('Submitting feedback payload:', feedbackData);

      this.feedbackService.createFeedback(feedbackData).subscribe({
        next: (res) => {
          console.log('Feedback submission success:', res);
          alert('Thank you for your feedback!');
          this.closeFeedback();
          this.submittingFeedback = false;
        },
        error: (err) => {
          console.error('Feedback submission error full object:', err);
          // Show more detailed error to user for debugging
          const errorMessage = err.error?.message || err.statusText || 'Unknown error';
          alert(`Failed to submit feedback: ${err.status} - ${errorMessage}`);
          this.submittingFeedback = false;
        }
      });
    } catch (e) {
      console.error('Error preparing feedback:', e);
      alert('An unexpected error occurred. Please try logging in again.');
      this.submittingFeedback = false;
    }
  }
}
