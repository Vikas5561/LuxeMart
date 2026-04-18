import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="admin-dashboard fade-in">
      <div class="dashboard-header">
        <div class="header-content">
          <div>
            <h1>Dashboard Overview</h1>
            <p class="subtitle">Welcome back! Here's what's happening with your store today.</p>
          </div>
          <button class="btn btn-primary btn-refresh" (click)="loadStats()">
            <span class="icon">🔄</span> Refresh Data
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card products">
          <div class="stat-icon-wrapper">
             <span class="stat-icon">📦</span>
          </div>
          <div class="stat-details">
            <p class="stat-label">Total Products</p>
            <h3 class="stat-value">{{ stats.totalProducts || 0 | number }}</h3>
          </div>
          <div class="stat-trend increasing">
            <span>↑ 12%</span>
            <span class="trend-label">vs last month</span>
          </div>
        </div>

        <div class="stat-card orders">
          <div class="stat-icon-wrapper">
            <span class="stat-icon">🛍️</span>
          </div>
          <div class="stat-details">
            <p class="stat-label">Total Orders</p>
            <h3 class="stat-value">{{ stats.totalOrders || 0 | number }}</h3>
          </div>
          <div class="stat-trend increasing">
             <span>↑ 8%</span>
             <span class="trend-label">vs last month</span>
          </div>
        </div>

        <div class="stat-card users">
          <div class="stat-icon-wrapper">
            <span class="stat-icon">👥</span>
          </div>
          <div class="stat-details">
            <p class="stat-label">Total Users</p>
            <h3 class="stat-value">{{ stats.totalUsers || 0 | number }}</h3>
          </div>
          <div class="stat-trend increasing">
            <span>↑ 15%</span>
            <span class="trend-label">vs last month</span>
          </div>
        </div>

        <div class="stat-card revenue">
          <div class="stat-icon-wrapper">
            <span class="stat-icon">💰</span>
          </div>
          <div class="stat-details">
             <p class="stat-label">Total Revenue</p>
             <h3 class="stat-value">₹{{ stats.totalRevenue || 0 | number:'1.0-0' }}</h3>
          </div>
          <div class="stat-trend increasing">
            <span>↑ 22%</span>
            <span class="trend-label">vs last month</span>
          </div>
        </div>
      </div>

      <div class="dashboard-grid mt-4">
        <!-- Order Status Card -->
        <div class="card status-card">
          <div class="card-header-simple">
            <h2>Order Status</h2>
          </div>
          <div class="status-list">
            <div class="status-item pending">
              <div class="status-info">
                <div class="status-icon-bg">🕒</div>
                <div class="status-text">
                  <span class="status-name">Pending</span>
                  <span class="status-desc">Awaiting processing</span>
                </div>
              </div>
              <span class="status-count">{{ stats.pendingOrders || 0 }}</span>
            </div>
            <div class="status-item shipped">
              <div class="status-info">
                <div class="status-icon-bg">🚚</div>
                <div class="status-text">
                  <span class="status-name">Shipped</span>
                  <span class="status-desc">In transit</span>
                </div>
              </div>
              <span class="status-count">{{ stats.shippedOrders || 0 }}</span>
            </div>
            <div class="status-item delivered">
              <div class="status-info">
                <div class="status-icon-bg">✅</div>
                <div class="status-text">
                   <span class="status-name">Delivered</span>
                   <span class="status-desc">Completed orders</span>
                </div>
              </div>
              <span class="status-count">{{ stats.deliveredOrders || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions Card -->
        <div class="card actions-card">
          <div class="card-header-simple">
             <h2>Quick Actions</h2>
          </div>
          <div class="actions-grid">
            <button class="action-btn" (click)="navigateTo('/admin/products')">
              <span class="action-icon">📦</span>
              <span class="action-label">Manage Products</span>
            </button>
            <button class="action-btn" (click)="navigateTo('/admin/orders')">
              <span class="action-icon">🛍️</span>
              <span class="action-label">View Orders</span>
            </button>
            <button class="action-btn" (click)="navigateTo('/admin/users')">
              <span class="action-icon">👥</span>
              <span class="action-label">Manage Users</span>
            </button>
            <button class="action-btn" (click)="navigateTo('/admin/reports')">
              <span class="action-icon">📊</span>
              <span class="action-label">View Reports</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Orders Table -->
      <div class="card recent-orders-card mt-4">
        <div class="card-header-flex">
          <h2>Recent Orders</h2>
          <button class="btn-link" (click)="navigateTo('/admin/orders')">View All Orders →</button>
        </div>
        
        <div class="orders-table-wrapper" *ngIf="stats.recentOrders && stats.recentOrders.length > 0; else noOrders">
          <table class="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of stats.recentOrders">
                <td class="font-medium">#{{ order.orderId }}</td>
                <td>
                    <div class="customer-cell">
                        <div class="avatar-xs">{{ order.user?.firstName?.charAt(0) }}</div>
                        <span>{{ order.user?.firstName }} {{ order.user?.lastName }}</span>
                    </div>
                </td>
                <td class="text-secondary">{{ order.orderDate | date:'mediumDate' }}</td>
                <td class="font-medium">₹{{ order.totalAmount | number:'1.0-0' }}</td>
                <td>
                  <span class="status-badge" [ngClass]="order.status.toLowerCase()">
                    {{ order.status }}
                  </span>
                </td>
                <td>
                  <select (change)="updateOrderStatus(order.orderId, $event)" class="status-select">
                    <option value="" disabled selected>Update Status</option>
                    <option value="CONFIRMED">Confirm</option>
                    <option value="SHIPPED">Ship</option>
                    <option value="DELIVERED">Deliver</option>
                    <option value="CANCELLED">Cancel</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <ng-template #noOrders>
           <div class="empty-state">
              <div class="empty-icon">📝</div>
              <p>No recent orders found</p>
           </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .dashboard-header {
      margin-bottom: 2.5rem;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .dashboard-header h1 {
      font-size: 2rem;
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
      font-weight: 700;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 1rem;
      margin: 0;
    }

    .btn-refresh {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        border-radius: 8px;
        font-weight: 600;
    }
    
    .btn-refresh:active {
        transform: translateY(1px);
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 16px;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
    }

    .stat-icon-wrapper {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
        font-size: 1.5rem;
    }

    .stat-card.products .stat-icon-wrapper { background: #e0f2fe; color: #0284c7; }
    .stat-card.orders .stat-icon-wrapper { background: #f3e8ff; color: #9333ea; }
    .stat-card.users .stat-icon-wrapper { background: #dcfce7; color: #16a34a; }
    .stat-card.revenue .stat-icon-wrapper { background: #ffedd5; color: #ea580c; }
    
    .stat-details {
        margin-bottom: auto;
    }

    .stat-label {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin: 0 0 0.25rem 0;
        font-weight: 500;
    }

    .stat-value {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
        line-height: 1.2;
    }

    .stat-trend {
        margin-top: 1rem;
        font-size: 0.85rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .stat-trend.increasing { color: #16a34a; }
    .trend-label { 
        color: var(--text-secondary); 
        font-weight: 400;
    }

    /* Dashboard Grid */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .card {
      background: white;
      border-radius: 16px;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
      overflow: hidden;
    }
    
    .card-header-simple {
        padding: 1.5rem;
        border-bottom: 1px solid var(--border-color);
    }
    .card-header-simple h2 {
        font-size: 1.1rem;
        font-weight: 700;
        margin: 0;
        color: var(--text-primary);
    }

    /* Status List */
    .status-list {
        padding: 1rem;
    }

    .status-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-radius: 12px;
      margin-bottom: 0.5rem;
      transition: background 0.2s;
    }

    .status-item:hover {
      background: #f8fafc;
    }

    .status-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .status-icon-bg {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    }
    
    .status-item.pending .status-icon-bg { background: #fff7ed; }
    .status-item.shipped .status-icon-bg { background: #eff6ff; }
    .status-item.delivered .status-icon-bg { background: #f0fdf4; }

    .status-text {
        display: flex;
        flex-direction: column;
    }

    .status-name {
        font-weight: 600;
        color: var(--text-primary);
        font-size: 0.95rem;
    }
    
    .status-desc {
        font-size: 0.8rem;
        color: var(--text-secondary);
    }

    .status-count {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    /* Actions Grid */
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      padding: 1.5rem;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 1.5rem;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      background: #f8fafc;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background: white;
      border-color: var(--primary-color);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    
    .action-icon { font-size: 2rem; margin-bottom: 0.25rem;}
    .action-label {
        font-weight: 600;
        color: var(--text-primary);
        font-size: 0.9rem;
    }

    /* Recent Orders */
    .recent-orders-card {
        padding-bottom: 0.5rem;
    }

    .card-header-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-color);
    }
    .card-header-flex h2 {
        font-size: 1.1rem;
        font-weight: 700;
        margin: 0;
        color: var(--text-primary);
    }

    .btn-link {
      background: none;
      border: none;
      color: var(--primary-color);
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
    }
    .btn-link:hover { text-decoration: underline; }

    .orders-table-wrapper {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      padding: 1rem 1.5rem;
      text-align: left;
      font-weight: 600;
      color: var(--text-secondary);
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border-color);
      background: #f8fafc;
    }

    .data-table td {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
      color: var(--text-primary);
      font-size: 0.95rem;
      vertical-align: middle;
    }
    
    .data-table tr:last-child td { border-bottom: none; }
    .data-table tbody tr:hover { background: #f8fafc; }

    .font-medium { font-weight: 500; }
    .text-secondary { color: var(--text-secondary); }

    .customer-cell {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .avatar-xs {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: var(--bg-secondary);
        color: var(--primary-color);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 700;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-badge.placed { background: #fef3c7; color: #92400e; }
    .status-badge.confirmed { background: #dbeafe; color: #1e40af; }
    .status-badge.shipped { background: #e0e7ff; color: #3730a3; }
    .status-badge.delivered { background: #d1fae5; color: #065f46; }
    .status-badge.cancelled { background: #fee2e2; color: #991b1b; }

    .status-select {
      padding: 0.4rem 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 0.85rem;
      color: var(--text-primary);
      background-color: white;
      cursor: pointer;
      outline: none;
    }
    .status-select:focus { border-color: var(--primary-color); }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-secondary);
    }
    
    .empty-icon {
        font-size: 3rem;
        margin-bottom: 0.5rem;
        opacity: 0.5;
    }

    @media (max-width: 968px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: any = {
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    recentOrders: []
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.http.get<any>('http://localhost:8080/api/admin/dashboard/stats', { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.stats = data;
          console.log('Dashboard stats loaded:', data);
        },
        error: (err) => {
          console.error('Error loading stats:', err);
          if (err.status === 401) {
            alert('Please login as admin first');
            this.router.navigate(['/admin/login']);
          }
        }
      });
  }

  updateOrderStatus(orderId: number, event: any) {
    const newStatus = event.target.value;
    if (!newStatus) return;

    // Optimistic update
    const order = this.stats.recentOrders.find((o: any) => o.orderId === orderId);
    const oldStatus = order ? order.status : '';
    if (order) order.status = newStatus;

    this.http.post<any>(`http://localhost:8080/api/admin/orders/${orderId}/status?status=${newStatus}`,
      {}, { withCredentials: true })
      .subscribe({
        next: () => {
          // alert('Order status updated successfully!');
          this.loadStats(); // Reload to ensure consistency
        },
        error: (err) => {
          alert('Error updating order status');
          console.error(err);
          if (order) order.status = oldStatus; // Revert on error
        }
      });
  }

  navigateTo(path: string) {
    // For now, check if the routes exist, otherwise show alert
    const validRoutes = ['/admin/products', '/admin/orders'];
    if (validRoutes.includes(path)) {
      this.router.navigate([path]);
    } else {
      alert(`Navigation to ${path} - This feature is coming soon!`);
    }
  }
}
