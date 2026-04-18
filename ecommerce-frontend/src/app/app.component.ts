import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { CartService } from './core/services/cart.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <app-toast></app-toast>
      <!-- 1. Global Header (Logo & Public Links) -->
      <!-- Show on ALL non-admin routes -->
      <header class="header" *ngIf="!isAdminRoute">
        <div class="container">
          <div class="flex-between">
            <a routerLink="/" class="logo-link">
              <h1 class="logo">
                <span class="logo-icon">🛍️</span> 
                <span class="logo-text">Luxe<span class="logo-accent">Mart</span></span>
              </h1>
            </a>
            
            <!-- Public Navbar (Text Links) - Show for non-logged in OR Admins on main site -->
            <nav class="nav-links" *ngIf="!isLoggedIn || isAdmin">
              <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">Home</a>
              <a routerLink="/login" routerLinkActive="active" class="btn btn-secondary btn-sm">Login</a>
              <a routerLink="/products" routerLinkActive="active" class="nav-item">Shop</a>
              <a routerLink="/register" routerLinkActive="active" class="nav-item">Sign Up</a>
            </nav>
            
            <!-- Mobile Menu Button -->
            <button class="mobile-menu-btn" (click)="toggleMobileMenu()">
              ☰
            </button>
          </div>
        </div>
      </header>

      <!-- 2. Logged In Customer Navigation (Blue Bar) -->
      <!-- Placed BELOW the main header -->
      <div class="top-bar" *ngIf="isLoggedIn && !isAdminRoute && !isAdmin">
        <div class="container">
          <div class="top-bar-content">
            <h1 class="welcome-msg">Welcome, {{customerName}}!</h1>
            <div class="top-nav">
              <a routerLink="/customer/home" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
                🏠 Home
              </a>
              <a routerLink="/cart" routerLinkActive="active">
                🛒 My Cart
                <span class="badge" *ngIf="cartItemCount > 0">{{cartItemCount}}</span>
              </a>
              <a routerLink="/customer/orders" routerLinkActive="active">
                📦 My Orders
              </a>
              <div class="profile-menu">
                <button class="profile-btn" (click)="toggleProfileDropdown()">
                  👤 Profile
                </button>
                <div class="profile-dropdown" *ngIf="showProfileDropdown">
                  <a routerLink="/customer/profile">View Profile</a>
                  <a routerLink="/customer/profile" [queryParams]="{mode: 'edit'}">Update Profile</a>
                  <hr>
                  <a (click)="logout()" style="color: var(--error-color); cursor: pointer;">Logout</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="footer" *ngIf="!isAdminRoute">
        <div class="container">
          <div class="footer-bottom" style="border-top: none; padding-top: 0;">
            <p>&copy; 2024 LuxeMart Inc. All rights reserved.</p>
            <div class="footer-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--bg-secondary);
    }
    
    /* Global Header Styles */
    .header {
        background: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        padding: 1rem 0;
        position: sticky;
        top: 0;
        z-index: 100;
    }

    .flex-between {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .logo-link {
        text-decoration: none;
    }

    .logo {
        font-size: 1.75rem;
        font-weight: 800;
        color: var(--text-primary);
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .logo-accent {
        color: var(--primary-color);
    }

    /* Blue Top Bar Styles (Logged In) */
    .top-bar {
        background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
        color: white;
        padding: 1rem 0;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 73px; /* Approximate height of the main header to stack nicely */
        z-index: 90;
    }

    .top-bar-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .welcome-msg {
        margin: 0;
        font-size: 1.25rem;
        color: white;
        font-weight: 600;
    }

    .top-nav {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .top-nav a, .profile-btn {
        color: white;
        text-decoration: none;
        padding: 0.6rem 1.2rem;
        border-radius: 99px; /* Pill shape */
        background: rgba(255, 255, 255, 0.1);
        transition: all 0.2s;
        position: relative;
        border: none;
        cursor: pointer;
        font-size: 0.95rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .top-nav a:hover, .profile-btn:hover, .top-nav a.active {
        background: white;
        color: var(--primary-color);
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .nav-links {
        display: flex;
        gap: 2rem;
        align-items: center;
    }

    .nav-item {
        color: var(--text-secondary);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;
    }

    .nav-item:hover, .nav-item.active {
        color: var(--primary-color);
    }

    .badge {
        background: var(--error-color);
        color: white;
        border-radius: 50%;
        padding: 0.1rem 0.4rem;
        font-size: 0.7rem;
        position: absolute;
        top: -5px;
        right: -5px;
    }

    .profile-menu {
        position: relative;
    }

    .profile-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        padding: 0.5rem;
        min-width: 150px;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 0.5rem;
        border: 1px solid var(--border-color);
    }

    .profile-dropdown a {
        color: var(--text-primary);
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-weight: normal;
        background: none;
        width: 100%;
        text-align: left;
        box-sizing: border-box;
    }

    .profile-dropdown a:hover {
        background: var(--bg-secondary);
        color: var(--primary-color);
        transform: none;
        box-shadow: none;
    }

    .mobile-menu-btn {
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-primary);
    }

    .main-content {
        flex: 1;
    }

    .footer {
        background: white;
        border-top: 1px solid var(--border-color);
        padding: 2rem 0;
        margin-top: auto;
    }

    .footer-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 2rem;
        border-top: 1px solid var(--border-color);
        font-size: 0.9rem;
        color: var(--text-secondary);
    }

    .footer-legal {
        display: flex;
        gap: 1.5rem;
    }

    .footer-legal a {
        color: var(--text-secondary);
        text-decoration: none;
    }

    @media (max-width: 768px) {
        .nav-links, .top-nav {
            display: none;
        }
        .mobile-menu-btn {
            display: block;
        }
    }
  `]
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  isAdminRoute = false;
  isMobileMenuOpen = false;
  customerName = 'Customer';
  cartItemCount = 0;
  showProfileDropdown = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isAdminRoute = event.url.includes('/admin');
      this.showProfileDropdown = false; // Close dropdown on route change
    });
  }

  ngOnInit() {
    // Subscribe to auth status
    console.log('AppComponent: Subscribing to isAuthenticated');
    this.authService.isAuthenticated().subscribe({
      next: (authenticated) => {
        console.log('AppComponent: Auth status changed:', authenticated);
        this.isLoggedIn = authenticated;
        if (authenticated) {
          this.isAdmin = this.authService.isAdmin();
          console.log('AppComponent: User logged in, fetching cart. Is Admin:', this.isAdmin);
          // Initial fetch to populate
          this.cartService.getCart().subscribe({ error: () => { } });
        } else {
          this.isAdmin = false;
        }
      },
      error: (err) => {
        console.error('AppComponent: Auth check error', err);
        this.isLoggedIn = false;
        this.isAdmin = false;
      }
    });

    // Subscribe to user details
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.customerName = user.firstName || 'Customer';
        this.isAdmin = user.userType === 'ADMIN';
      } else {
        this.customerName = 'Customer';
        this.isAdmin = false;
      }
    });

    // Subscribe to cart changes
    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart?.items?.length || 0;
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.showProfileDropdown = false;
  }
}
