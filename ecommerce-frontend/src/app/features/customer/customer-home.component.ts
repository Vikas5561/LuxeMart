import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { OfferService } from '../../core/services/offer.service';

@Component({
    selector: 'app-customer-home',
    template: `
    <div class="customer-container">
      <!-- Offers Banner -->
      <div class="offers-section" *ngIf="offers.length > 0">
        <div class="container">
          <div class="offers-wrapper">
             <div class="offer-card" *ngFor="let offer of offers">
                <div class="offer-content">
                   <span class="offer-tag">Special Offer</span>
                   <h3>{{offer.title}}</h3>
                   <p>{{offer.description}}</p>
                   <div class="coupon-code">
                      Use Code: <span class="code">{{offer.discountCode}}</span>
                      <span class="discount">{{offer.discountPercentage}}% OFF</span>
                   </div>
                </div>

             </div>
          </div>
        </div>
      </div>

      <!-- Search and Filter Section -->
      <div class="search-section">
        <div class="container">
          <div class="search-bar">
            <input type="text" [(ngModel)]="searchQuery" 
                   placeholder="Search by Product ID or Name..."
                   class="search-input"
                   (input)="onSearch()">
            <select [(ngModel)]="selectedCategory" 
                    class="category-filter"
                    (change)="onCategoryChange()">
              <option value="">All Categories</option>
              <option value="Fashion">Fashion</option>
              <option value="Electronics">Electronics</option>
              <option value="Stationary">Stationary</option>
              <option value="Home Decor">Home Decor</option>
            </select>
            <button class="btn btn-primary" (click)="clearFilters()">Clear Filters</button>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="container">
        <div *ngIf="loading" class="loading">
          <div class="spinner"></div>
          <p>Loading products...</p>
        </div>

        <div *ngIf="!loading && products.length === 0" class="no-products">
          <h3>No products found</h3>
          <p>Try adjusting your search or filters</p>
        </div>

        <div class="products-grid" *ngIf="!loading && products.length > 0">
          <div class="product-card" *ngFor="let product of products">
            <div class="product-image">
              <img [src]="product.imageUrl || 'assets/placeholder-product.png'" 
                   [alt]="product.productName">
              <span class="status-badge" 
                    [class.out-of-stock]="product.quantityAvailable < 1">
                {{product.quantityAvailable >= 1 ? 'In Stock' : 'Out of Stock'}}
              </span>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{product.productName}}</h3>
              <p class="product-category">{{product.category}}</p>
              <p class="product-price">₹{{product.price | number:'1.2-2'}}</p>
              <p class="product-description">{{product.description}}</p>
              <p class="product-stock">
                Available: <strong>{{product.quantityAvailable}}</strong>
              </p>
              
              <div class="product-actions">
                <button class="btn btn-primary" 
                        *ngIf="product.quantityAvailable >= 1"
                        (click)="addToCart(product)"
                        [disabled]="addingToCart[product.productId]">
                  {{addingToCart[product.productId] ? 'Adding...' : '🛒 Add to Cart'}}
                </button>
                <button class="btn btn-secondary" 
                        *ngIf="product.quantityAvailable < 1"
                        disabled>
                  ❌ Product Not Available
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <div class="toast" *ngIf="message" [class.success]="messageType === 'success'" [class.error]="messageType === 'error'">
        {{message}}
      </div>
    </div>
  `,
    styles: [`
        .customer-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding-top: 1rem;
        }

        /* Offers Section Styles */
        .offers-section {
            padding: 1rem 0 0;
        }
        
        .offers-wrapper {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
        
        .offer-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 0.75rem 1.25rem;
            border-radius: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 10px rgba(118, 75, 162, 0.2);
            transition: transform 0.3s ease;
            min-height: auto;
        }
        
        .offer-card:hover { transform: translateY(-2px); }
        
        .offer-content {
            display: flex;
            align-items: center;
            gap: 1rem;
            width: 100%;
            flex-wrap: wrap;
        }

        .offer-tag {
            background: rgba(255,255,255,0.2);
            padding: 0.2rem 0.6rem;
            border-radius: 20px;
            font-size: 0.7rem;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            white-space: nowrap;
        }
        
        .offer-content h3 {
            margin: 0;
            font-size: 1rem;
            white-space: nowrap;
            /* Separator */
            border-right: 1px solid rgba(255,255,255,0.3);
            padding-right: 1rem;
            line-height: 1.2;
        }
        
        .offer-content p {
            margin: 0;
            opacity: 0.9;
            font-size: 0.85rem;
            display: none; /* Default hide description to save space */
        }

        @media (min-width: 768px) {
            .offer-content p {
                display: block; /* Show on larger screens */
            }
        }
        
        .coupon-code {
            background: white;
            color: #764ba2;
            padding: 0.3rem 0.8rem;
            border-radius: 6px;
            display: flex;
            align-items: center;
            font-weight: 500;
            font-size: 0.85rem;
            margin-left: auto;
            white-space: nowrap;
        }
        
        .code {
            font-weight: 800;
            font-family: monospace;
            font-size: 1rem;
            margin-left: 0.25rem;
        }
        
        .discount {
            margin-left: 0.5rem;
            font-weight: bold;
            color: #d53f8c;
        }
        
        .offer-icon {
            display: none;
        }

        .search-section {
            background: white;
            padding: 2rem 0;
            box-shadow: var(--shadow-sm);
            margin-top: 2rem;
        }

        .search-bar {
            display: flex;
            gap: 1rem;
            align-items: center;
        }

        .search-input {
            flex: 1;
            padding: 0.75rem 1rem;
            border: 2px solid var(--border-color);
            border-radius: var(--radius-md);
            font-size: 1rem;
        }

        .category-filter {
            padding: 0.75rem 1rem;
            border: 2px solid var(--border-color);
            border-radius: var(--radius-md);
            min-width: 200px;
        }

        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 2rem;
            padding: 2rem 0;
        }

        .product-card {
            background: white;
            border-radius: var(--radius-lg);
            overflow: hidden;
            box-shadow: var(--shadow-md);
            transition: all var(--transition-normal);
        }

        .product-card:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow-xl);
        }

        .product-image {
            position: relative;
            height: 200px;
            overflow: hidden;
        }

        .product-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .status-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background: var(--success-color);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: var(--radius-md);
            font-size: 0.875rem;
            font-weight: bold;
        }

        .status-badge.out-of-stock {
            background: var(--error-color);
        }

        .product-info {
            padding: 1.5rem;
        }

        .product-name {
            margin: 0 0 0.5rem 0;
            font-size: 1.25rem;
            color: var(--text-primary);
        }

        .product-category {
            color: var(--text-secondary);
            font-size: 0.875rem;
            margin: 0 0 0.5rem 0;
        }

        .product-price {
            font-size: 1.5rem;
            color: var(--primary-color);
            font-weight: bold;
            margin: 0.5rem 0;
        }

        .product-description {
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin: 0.5rem 0;
        }

        .product-stock {
            font-size: 0.9rem;
            margin: 0.5rem 0;
        }

        .product-actions {
            margin-top: 1rem;
        }

        .loading, .no-products {
            text-align: center;
            padding: 4rem 0;
        }

        .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid var(--border-color);
            border-top-color: var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem auto;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .toast {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            padding: 1rem 2rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-xl);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        }

        .toast.success {
            background: var(--success-color);
            color: white;
        }

        .toast.error {
            background: var(--error-color);
            color: white;
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `]
})
export class CustomerHomeComponent implements OnInit {
    products: any[] = [];
    offers: any[] = []; // New offers array
    searchQuery = '';
    selectedCategory = '';
    loading = false;

    addingToCart: { [key: number]: boolean } = {};

    message = '';
    messageType: 'success' | 'error' = 'success';

    constructor(
        private productService: ProductService,
        private cartService: CartService,
        private offerService: OfferService // Inject OfferService
    ) { }

    ngOnInit() {
        this.loadProducts();
        this.loadActiveOffers(); // Load offers
    }

    loadActiveOffers() {
        this.offerService.getActiveOffers().subscribe({
            next: (data) => {
                this.offers = data;
            },
            error: (err) => console.error('Error loading offers', err)
        });
    }

    loadProducts() {
        this.loading = true;
        this.productService.getAllProducts().subscribe({
            next: (products) => {
                // Filter only active products for customers
                this.products = products.filter((p: any) => p.status === 'Active');
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading products:', err);
                this.showMessage('Failed to load products', 'error');
                this.loading = false;
            }
        });
    }

    onSearch() {
        if (!this.searchQuery.trim()) {
            this.loadProducts();
            return;
        }

        this.loading = true;
        this.productService.searchProducts(this.searchQuery).subscribe({
            next: (products) => {
                this.products = products.filter((p: any) => p.status === 'Active');
                this.loading = false;
            },
            error: (err) => {
                console.error('Search error:', err);
                this.loading = false;
            }
        });
    }

    onCategoryChange() {
        if (!this.selectedCategory) {
            this.loadProducts();
            return;
        }

        this.loading = true;
        this.productService.getProductsByCategory(this.selectedCategory).subscribe({
            next: (products) => {
                this.products = products.filter((p: any) => p.status === 'Active');
                this.loading = false;
            },
            error: (err) => {
                console.error('Filter error:', err);
                this.loading = false;
            }
        });
    }

    clearFilters() {
        this.searchQuery = '';
        this.selectedCategory = '';
        this.loadProducts();
    }

    addToCart(product: any) {
        this.addingToCart[product.productId] = true;

        this.cartService.addToCart(product.productId, 1).subscribe({
            next: () => {
                this.addingToCart[product.productId] = false;
                this.showMessage('Product added to cart successfully!', 'success');
            },
            error: (err) => {
                this.addingToCart[product.productId] = false;
                this.showMessage(err.error?.error || 'Failed to add product to cart', 'error');
            }
        });
    }


    showMessage(msg: string, type: 'success' | 'error') {
        this.message = msg;
        this.messageType = type;
        setTimeout(() => {
            this.message = '';
        }, 3000);
    }
}
