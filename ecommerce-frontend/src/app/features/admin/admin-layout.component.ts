import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  template: `
    <div class="admin-container">
      <!-- Sidebar Navigation -->
      <aside class="sidebar" [class.open]="sidebarOpen">
        <div class="sidebar-header">
          <div class="logo">
             <span class="logo-icon">💠</span>
             <span class="logo-text">Luxe<span class="logo-accent">Admin</span></span>
          </div>
          <button class="close-sidebar-btn" (click)="toggleSidebar()">×</button>
        </div>
        
        <nav class="sidebar-nav">
          <div class="nav-section">
            <span class="section-label">Overview</span>
            <a routerLink="/admin/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
              <span class="nav-icon">📊</span>
              <span class="nav-label">Dashboard</span>
            </a>
          </div>
          
          <div class="nav-section">
            <span class="section-label">Inventory</span>
            <a routerLink="/admin/products" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
              <span class="nav-icon">📦</span> 
              <span class="nav-label">Product List</span>
            </a>
            <a routerLink="/admin/products/add" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">➕</span>
              <span class="nav-label">Add Product</span>
            </a>
            <a routerLink="/admin/products/update" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">✏️</span>
              <span class="nav-label">Update Stock</span>
            </a>
          </div>
          
          <div class="nav-section">
            <span class="section-label">Sales & CRM</span>
            <a routerLink="/admin/orders" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">🛍️</span>
              <span class="nav-label">Orders</span>
            </a>
            <a routerLink="/admin/customers" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">👥</span>
              <span class="nav-label">Customers</span>
            </a>
            <a routerLink="/admin/feedback" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">💬</span>
              <span class="nav-label">Feedback</span>
            </a>
            <a routerLink="/admin/offers" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">🏷️</span>
              <span class="nav-label">Offers</span>
            </a>
          </div>
        </nav>
        
        <div class="sidebar-footer">
          <button class="btn-logout" (click)="logout()">
            <span class="nav-icon">🚪</span> Logout
          </button>
        </div>
      </aside>
      
      <!-- Main Content Area -->
      <div class="main-wrapper">
        <!-- Top Header -->
        <header class="admin-header">
          <div class="header-left">
             <button class="menu-toggle" (click)="toggleSidebar()">☰</button>
             <h2 class="page-title">{{ getPageTitle() }}</h2>
          </div>
          
          <div class="header-right">
             <div class="notifications-bell">
                <span class="icon">🔔</span>
                <span class="dot"></span>
             </div>
             
             <div class="admin-profile">
               <div class="avatar">{{ adminName.charAt(0) }}</div>
               <div class="profile-info">
                 <span class="name">{{ adminName }}</span>
                 <span class="role">Administrator</span>
               </div>
             </div>
          </div>
        </header>
        
        <!-- Page Content -->
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </div>
      
      <!-- Overlay -->
      <div class="sidebar-overlay" [class.open]="sidebarOpen" (click)="toggleSidebar()"></div>
    </div>
  `,
  styles: [`
    .admin-container {
      display: flex;
      min-height: 100vh;
      background-color: #f8fafc; /* Slate 50 */
    }
    
    /* Sidebar Styles */
    .sidebar {
      width: 260px;
      background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
      color: white;
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
      z-index: 1000;
      transition: transform var(--transition-normal);
      box-shadow: 4px 0 10px rgba(0,0,0,0.1);
    }
    
    .sidebar-header {
      padding: 1.75rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 1.4rem;
      font-weight: 800;
      color: white;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      letter-spacing: -0.02em;
    }
    
    .logo-accent { color: var(--secondary-color); font-weight: 300; }
    
    .close-sidebar-btn {
      display: none;
      background: none; border: none;
      color: white; font-size: 1.5rem; cursor: pointer;
    }
    
    .sidebar-nav {
      flex: 1;
      padding: 1.5rem 1rem;
      overflow-y: auto;
    }
    
    .nav-section { margin-bottom: 2rem; }
    
    .section-label {
      display: block;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #64748b; /* Slate 500 */
      margin-bottom: 0.75rem;
      padding-left: 0.75rem;
      font-weight: 700;
    }
    
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.85rem;
      color: #cbd5e1; /* Slate 300 */
      text-decoration: none;
      border-radius: 12px;
      transition: all 0.2s;
      margin-bottom: 0.25rem;
      font-size: 0.95rem;
      font-weight: 500;
    }
    
    .nav-item:hover {
      background: rgba(255, 255, 255, 0.05);
      color: white;
      transform: translateX(4px);
    }
    
    .nav-item.active {
      background: var(--primary-color);
      color: white;
      box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
    }
    
    .nav-icon {
      font-size: 1.1rem;
      width: 24px;
      text-align: center;
    }
    
    .sidebar-footer {
      padding: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .btn-logout {
      width: 100%;
      display: flex; align-items: center; justify-content: center;
      gap: 0.75rem;
      padding: 0.85rem;
      background: rgba(239, 68, 68, 0.1);
      color: #fca5a5;
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }
    
    .btn-logout:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #fca5a5;
    }
    
    /* Main Wrapper */
    .main-wrapper {
      flex: 1;
      margin-left: 260px;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      transition: margin-left var(--transition-normal);
    }
    
    /* Admin Header */
    .admin-header {
      background: white;
      padding: 1rem 2rem;
      height: 70px;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky; top: 0; z-index: 900;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    }
    
    .header-left { display: flex; align-items: center; gap: 1rem; }
    
    .page-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
        display: none;
    }
    @mediaWith(min-width: 1024px) { .page-title { display: block; } }
    
    .menu-toggle {
      display: none;
      background: none; border: none;
      font-size: 1.5rem; cursor: pointer;
      color: var(--text-primary);
    }
    
    .header-right { margin-left: auto; display: flex; align-items: center; gap: 1.5rem; }
    
    .notifications-bell {
        position: relative;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: background 0.2s;
    }
    .notifications-bell:hover { background: #f1f5f9; }
    .notifications-bell .icon { font-size: 1.2rem; }
    .notifications-bell .dot {
        position: absolute; top: 8px; right: 8px;
        width: 8px; height: 8px; background: #ef4444;
        border-radius: 50%; border: 2px solid white;
    }
    
    .admin-profile {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.5rem 0.75rem;
      border-radius: 30px;
      cursor: pointer;
      transition: background 0.2s;
      border: 1px solid transparent;
    }
    .admin-profile:hover { background: #f8fafc; border-color: var(--border-color); }
    
    .avatar {
      width: 38px; height: 38px;
      background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
      color: white;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700;
      font-size: 1rem;
      box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
    }
    
    .profile-info { display: flex; flex-direction: column; line-height: 1.3; }
    .name { font-weight: 600; font-size: 0.9rem; color: var(--text-primary); }
    .role { font-size: 0.75rem; color: var(--text-secondary); font-weight: 500; }
    
    /* Content Area */
    .content-area {
      padding: 0;
      flex: 1;
      overflow-x: hidden;
    }
    
    /* Mobile Responsive */
    @media (max-width: 1024px) {
      .sidebar { transform: translateX(-100%); }
      .sidebar.open { transform: translateX(0); }
      .main-wrapper { margin-left: 0; }
      .menu-toggle { display: block; }
      .close-sidebar-btn { display: block; }
      
      .sidebar-overlay {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 999;
        display: none;
        backdrop-filter: blur(2px);
      }
      .sidebar-overlay.open { display: block; }
    }
  `]
})
export class AdminLayoutComponent implements OnInit {
  adminName = 'Admin';
  sidebarOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.adminName = user.firstName || 'Admin';
      }
    });

    // Close sidebar on route change (for mobile)
    this.router.events.subscribe(() => {
      this.sidebarOpen = false;
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  getPageTitle(): string {
    const url = this.router.url;
    if (url.includes('/dashboard')) return 'Dashboard Overview';
    if (url.includes('/products/add')) return 'Add New Product';
    if (url.includes('/products/update')) return 'Update Product';
    if (url.includes('/products')) return 'Product Inventory';
    if (url.includes('/orders')) return 'Order Management';
    if (url.includes('/customers')) return 'Customer Base';
    if (url.includes('/feedback')) return 'Customer Feedback';
    if (url.includes('/offers/add')) return 'Create New Offer';
    if (url.includes('/offers')) return 'Manage Offers';
    return 'Admin Panel';
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/admin/login']);
      },
      error: () => {
        this.router.navigate(['/admin/login']);
      }
    });
  }
}
