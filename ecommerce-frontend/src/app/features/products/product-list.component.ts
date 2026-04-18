import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="container main-container">
      <div class="header-section fade-in">
        <h1>Explore Our Collection</h1>
        <p class="subtitle">Discover premium quality products selected just for you</p>
      </div>
      
      <div class="search-container fade-in">
        <div class="search-wrapper">
          <span class="search-icon">🔍</span>
          <input type="text" [(ngModel)]="searchQuery" (input)="searchProducts()" 
                 placeholder="Search for products..." class="search-input">
        </div>
      </div>

      <div class="grid grid-4 product-grid fade-in">
        <div *ngFor="let product of products" class="product-card" [routerLink]="['/product', product.productId]">
          <div class="card-img-wrapper">
            <span class="badge badge-category">{{ product.category?.name }}</span>
            <img [src]="product.imageUrl" [alt]="product.name" class="product-image">
            <div class="card-overlay">
              <button class="btn-view">View Details</button>
            </div>
          </div>
          
          <div class="card-body">
            <h3 class="product-title" title="{{ product.name }}">{{ product.name }}</h3>
            <p class="product-description">{{ product.description | slice:0:60 }}...</p>
            
            <div class="product-meta">
              <div class="price-wrapper">
                <span class="price">₹{{ product.discountPrice || product.price | number:'1.0-0' }}</span>
                <span *ngIf="product.discountPrice" class="original-price">₹{{ product.price | number:'1.0-0' }}</span>
              </div>
              <div class="rating-badge">
                <span>⭐ {{ product.rating }}</span>
              </div>
            </div>

            <button (click)="$event.stopPropagation(); addToCart(product)" class="btn btn-primary btn-add-cart">
              <span class="icon">🛒</span> Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="products.length === 0" class="empty-state fade-in">
        <div class="empty-icon">🔍</div>
        <h2>No products found</h2>
        <p>Try adjusting your search to find what you're looking for.</p>
      </div>
    </div>
  `,
  styles: [`
    .main-container {
      padding-top: 2rem;
      padding-bottom: 4rem;
    }

    .header-section {
      text-align: center;
      margin-bottom: 3rem;
    }

    .header-section h1 {
      font-size: 2.5rem;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
    }

    /* Search Bar */
    .search-container {
      display: flex;
      justify-content: center;
      margin-bottom: 3rem;
    }

    .search-wrapper {
      position: relative;
      width: 100%;
      max-width: 500px;
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-secondary);
      font-size: 1.2rem;
    }

    .search-input {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      border: 2px solid var(--border-color);
      border-radius: 50px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: white;
      box-shadow: var(--shadow-sm);
    }

    .search-input:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 4px rgba(26, 54, 93, 0.1);
      outline: none;
    }

    /* Product Grid */
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 2rem;
    }

    .product-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid var(--border-color);
      transition: all 0.3s ease;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-lg);
    }

    .card-img-wrapper {
      position: relative;
      height: 240px;
      background: #f8fafc;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .product-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transition: transform 0.3s ease;
    }

    .product-card:hover .product-image {
      transform: scale(1.05);
    }

    .card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .product-card:hover .card-overlay {
      opacity: 1;
    }

    .btn-view {
      background: white;
      color: var(--text-primary);
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-weight: 600;
      border: none;
      transform: translateY(10px);
      transition: transform 0.3s ease;
    }

    .product-card:hover .btn-view {
      transform: translateY(0);
    }

    .badge-category {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: rgba(255, 255, 255, 0.9);
      color: var(--primary-color);
      padding: 0.25rem 0.75rem;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 600;
      z-index: 1;
      backdrop-filter: blur(4px);
    }

    .card-body {
      padding: 1.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .product-title {
      font-size: 1.1rem;
      margin: 0 0 0.5rem;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .product-description {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-bottom: 1rem;
      line-height: 1.5;
      height: 2.7em; /* Limit to 2 lines */
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .product-meta {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 1rem;
      margin-top: auto;
    }

    .price-wrapper {
      display: flex;
      flex-direction: column;
    }

    .price {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .original-price {
      font-size: 0.9rem;
      text-decoration: line-through;
      color: var(--text-secondary);
    }

    .rating-badge {
      background: #fffbeb;
      color: #b45309;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .btn-add-cart {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      border-radius: 8px;
      font-weight: 600;
      transition: background 0.2s;
    }

    .btn-add-cart:hover {
      transform: translateY(-1px);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 1rem;
      color: var(--text-secondary);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    @media (max-width: 640px) {
      .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 1rem;
      }
      
      .card-img-wrapper {
        height: 180px;
      }

      .card-body {
        padding: 1rem;
      }

      .btn-view {
        display: none; /* Hide hover button on mobile */
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  searchQuery: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (products) => this.products = products,
      error: (err) => console.error('Error loading products:', err)
    });
  }

  searchProducts() {
    if (this.searchQuery) {
      this.productService.searchProducts(this.searchQuery).subscribe({
        next: (products) => this.products = products,
        error: (err) => console.error('Error searching:', err)
      });
    } else {
      this.loadProducts();
    }
  }

  addToCart(product: any) {
    this.cartService.addToCart(product.productId, 1).subscribe({
      next: () => alert('Product added to cart!'),
      error: (err) => {
        alert('Please login first to add items to cart');
        this.router.navigate(['/login']);
      }
    });
  }
}
