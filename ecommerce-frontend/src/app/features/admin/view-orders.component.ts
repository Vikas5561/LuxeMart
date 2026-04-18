import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Order {
  orderId: number;
  user?: any;
  orderDate: string;
  totalAmount: number; // Changed from totalPrice to match backend
  status: string;
  deliveryAddress?: string;
  estimatedDelivery?: string;
  items?: any[];
}

@Component({
  selector: 'app-view-orders',
  template: `
    <div class="view-orders-container fade-in">
      <div class="header-section">
        <div>
            <h1>🛍️ Order Management</h1>
            <p class="subtitle">Track and manage customer orders.</p>
        </div>
        <div class="header-actions">
           <button class="btn btn-primary" (click)="loadOrders()">🔄 Refresh Orders</button>
        </div>
      </div>

      <!-- Stats / Tabs -->
      <div class="stats-overview">
         <div class="stat-card" [class.active]="selectedStatus === 'ALL'" (click)="filterByStatus('ALL')">
             <div class="stat-value">{{allOrders.length}}</div>
             <div class="stat-label">Total Orders</div>
         </div>
         <div class="stat-card" [class.active]="selectedStatus === 'CONFIRMED'" (click)="filterByStatus('CONFIRMED')">
             <div class="stat-value text-blue">{{getCountByStatus('CONFIRMED')}}</div>
             <div class="stat-label">Confirmed</div>
         </div>
         <div class="stat-card" [class.active]="selectedStatus === 'SHIPPED'" (click)="filterByStatus('SHIPPED')">
             <div class="stat-value text-indigo">{{getCountByStatus('SHIPPED')}}</div>
             <div class="stat-label">Shipped</div>
         </div>
         <div class="stat-card" [class.active]="selectedStatus === 'DELIVERED'" (click)="filterByStatus('DELIVERED')">
             <div class="stat-value text-green">{{getCountByStatus('DELIVERED')}}</div>
             <div class="stat-label">Delivered</div>
         </div>
         <div class="stat-card" [class.active]="selectedStatus === 'CANCELLED'" (click)="filterByStatus('CANCELLED')">
             <div class="stat-value text-red">{{getCountByStatus('CANCELLED')}}</div>
             <div class="stat-label">Cancelled</div>
         </div>
      </div>

      <!-- Orders List / Table -->
      <div class="orders-card" *ngIf="!loading">
        <div *ngIf="filteredOrders.length > 0; else noData">
            <div class="table-responsive">
                <table class="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let order of filteredOrders">
                      <td><span class="order-id">#{{order.orderId}}</span></td>
                      <td>
                        <div class="date-cell">
                            <span class="date">{{order.orderDate | date:'mediumDate'}}</span>
                            <span class="time">{{order.orderDate | date:'shortTime'}}</span>
                        </div>
                      </td>
                      <td>
                        <div class="customer-info">
                            <div class="avatar">{{(order.user?.name?.charAt(0) || 'U') | uppercase}}</div>
                            <div class="details">
                                <span class="name">{{order.user?.name || 'Unknown'}}</span>
                                <span class="email">{{order.user?.email}}</span>
                            </div>
                        </div>
                      </td>
                      <td class="price-cell">₹{{order.totalAmount | number:'1.2-2'}}</td>
                      <td>
                        <span class="status-badge" [ngClass]="order.status.toLowerCase()">
                          {{order.status}}
                        </span>
                      </td>
                      <td>
                        <!-- Action Dropdown for cleaner UI -->
                         <div class="action-group">
                             <button class="btn-action" 
                                     *ngIf="order.status === 'PLACED'" 
                                     (click)="updateStatus(order, 'CONFIRMED')"
                                     title="Confirm Order">✅</button>
                             
                             <button class="btn-action" 
                                     *ngIf="order.status === 'CONFIRMED'" 
                                     (click)="updateStatus(order, 'SHIPPED')"
                                     title="Ship Order">🚚</button>
                                     
                             <button class="btn-action" 
                                     *ngIf="order.status === 'SHIPPED'" 
                                     (click)="updateStatus(order, 'DELIVERED')"
                                     title="Mark Delivered">📦</button>
                                     
                             <button class="btn-action danger" 
                                     *ngIf="['PLACED', 'CONFIRMED'].includes(order.status)" 
                                     (click)="updateStatus(order, 'CANCELLED')"
                                     title="Cancel Order">❌</button>

                            <button class="btn-action info" (click)="viewDetails(order)" title="View Details">
                                👁️
                            </button>
                         </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
            </div>
        </div>
        
        <ng-template #noData>
            <div class="empty-state">
                <div class="empty-icon">📝</div>
                <h3>No orders found</h3>
                <p>There are no orders with status "{{selectedStatus}}"</p>
                <button class="btn btn-secondary mt-3" (click)="filterByStatus('ALL')">View All Orders</button>
            </div>
        </ng-template>
      </div>

      <div *ngIf="loading" class="loading-state">
         <div class="spinner"></div>
         <p>Fetching orders...</p>
      </div>
      
      <!-- Order Detail Modal (Simple Implementation) -->
      <div class="modal-backdrop" *ngIf="selectedOrder" (click)="closeDetails()">
          <div class="modal-content" (click)="$event.stopPropagation()">
              <div class="modal-header">
                  <h2>Order #{{selectedOrder.orderId}}</h2>
                  <button class="btn-close" (click)="closeDetails()">×</button>
              </div>
              <div class="modal-body">
                  <div class="detail-section">
                      <h3>📦 Items</h3>
                      <div class="item-list">
                          <div class="order-item" *ngFor="let item of selectedOrder.items">
                              <span class="item-name">{{item.productName || item.product?.name}}</span>
                              <span class="item-qty">x{{item.quantity}}</span>
                              <span class="item-price">₹{{item.price * item.quantity | number}}</span>
                          </div>
                      </div>
                  </div>
                  <div class="detail-section">
                      <h3>📍 Shipping Details</h3>
                      <p><strong>Address:</strong> {{selectedOrder.deliveryAddress || selectedOrder.user?.address1 || 'N/A'}}</p>
                      <p><strong>Est. Delivery:</strong> {{selectedOrder.estimatedDelivery ? (selectedOrder.estimatedDelivery | date:'mediumDate') : 'Pending'}}</p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  `,
  styles: [`
    .view-orders-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 2rem;
    }
    
    .header-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }
    .header-section h1 { font-size: 1.75rem; margin: 0 0 0.5rem 0; color: var(--text-primary); }
    .subtitle { color: var(--text-secondary); margin: 0; }

    /* Stats Overview */
    .stats-overview {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: var(--shadow-sm);
        text-align: center;
        cursor: pointer;
        border: 2px solid transparent;
        transition: all 0.2s;
    }

    .stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
    .stat-card.active { border-color: var(--primary-color); background: #eff6ff; }

    .stat-value { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem; }
    .stat-label { font-size: 0.85rem; color: var(--text-secondary); font-weight: 500; }
    
    .text-blue { color: #2563eb; }
    .text-indigo { color: #4f46e5; }
    .text-green { color: #059669; }
    .text-red { color: #dc2626; }

    /* Table */
    .orders-card {
        background: white;
        border-radius: 16px;
        box-shadow: var(--shadow-sm);
        overflow: hidden;
        border: 1px solid var(--border-color);
    }

    .orders-table { width: 100%; border-collapse: collapse; }
    
    .orders-table th {
        padding: 1rem 1.5rem;
        text-align: left;
        background: #f8fafc;
        font-weight: 600;
        color: var(--text-secondary);
        font-size: 0.85rem;
        text-transform: uppercase;
    }

    .orders-table td {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--border-color);
        vertical-align: middle;
    }

    .order-id { font-weight: 600; color: var(--primary-color); }
    
    .date-cell { display: flex; flex-direction: column; }
    .date-cell .time { font-size: 0.8rem; color: var(--text-secondary); }

    .customer-info { display: flex; align-items: center; gap: 0.75rem; }
    .avatar {
        width: 36px; height: 36px;
        background: #e0f2fe; color: #0369a1;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-weight: 600;
    }
    .customer-info .details { display: flex; flex-direction: column; }
    .customer-info .name { font-weight: 500; font-size: 0.95rem; }
    .customer-info .email { font-size: 0.8rem; color: var(--text-secondary); }

    .price-cell { font-weight: 600; font-family: monospace; font-size: 1rem; }

    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: capitalize;
    }
    .status-badge.placed { background: #fffbeb; color: #92400e; }
    .status-badge.confirmed { background: #eff6ff; color: #1e40af; }
    .status-badge.shipped { background: #eef2ff; color: #3730a3; }
    .status-badge.delivered { background: #ecfdf5; color: #065f46; }
    .status-badge.cancelled { background: #fef2f2; color: #991b1b; }

    .action-group { display: flex; gap: 0.5rem; }
    .btn-action {
        width: 32px; height: 32px;
        border-radius: 6px;
        border: 1px solid var(--border-color);
        background: white;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.2s;
    }
    .btn-action:hover { background: #f8fafc; border-color: var(--primary-color); }
    .btn-action.danger:hover { background: #fee2e2; border-color: #ef4444; }

    /* Empty State */
    .empty-state { text-align: center; padding: 4rem; color: var(--text-secondary); }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }

    /* Modal */
    .modal-backdrop {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex; align-items: center; justify-content: center;
        z-index: 1000;
    }
    .modal-content {
        background: white;
        border-radius: 12px;
        width: 100%; max-width: 500px;
        box-shadow: var(--shadow-xl);
    }
    .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid var(--border-color);
        display: flex; justify-content: space-between; align-items: center;
    }
    .modal-header h2 { margin: 0; font-size: 1.25rem; }
    .btn-close { font-size: 1.5rem; border: none; background: none; cursor: pointer; }
    .modal-body { padding: 1.5rem; }
    .detail-section { margin-bottom: 1.5rem; }
    .detail-section h3 { font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 0.75rem; }
    .order-item {
        display: flex; justify-content: space-between;
        padding: 0.5rem 0; border-bottom: 1px dashed var(--border-color);
    }
    .order-item:last-child { border-bottom: none; }
    .item-name { font-weight: 500; }
  `]
})
export class ViewOrdersComponent implements OnInit {
  allOrders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedStatus = 'ALL';
  loading = false;
  selectedOrder: Order | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.http.get<Order[]>('http://localhost:8080/api/admin/orders',
      { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.allOrders = data;
          this.filterByStatus(this.selectedStatus);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading orders:', err);
          this.loading = false;
        }
      });
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
    if (status === 'ALL') {
      this.filteredOrders = [...this.allOrders];
    } else {
      this.filteredOrders = this.allOrders.filter(o => o.status === status);
    }
  }

  getCountByStatus(status: string): number {
    return this.allOrders.filter(o => o.status === status).length;
  }

  updateStatus(order: Order, newStatus: string) {
    const confirmMsg = `Change order #${order.orderId} status to ${newStatus}?`;
    if (!confirm(confirmMsg)) return;

    this.http.post(`http://localhost:8080/api/admin/orders/${order.orderId}/status?status=${newStatus}`,
      {}, { withCredentials: true })
      .subscribe({
        next: () => {
          order.status = newStatus; // Optimistic update
          this.filterByStatus(this.selectedStatus); // Re-filter if needed
        },
        error: (err) => {
          alert('Error updating status: ' + (err.error?.error || 'Unknown error'));
        }
      });
  }

  viewDetails(order: Order) {
    this.selectedOrder = order;
  }

  closeDetails() {
    this.selectedOrder = null;
  }
}
