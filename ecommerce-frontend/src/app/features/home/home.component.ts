import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="hero-section">
      <div class="container">
        <div class="hero-content fade-in">
          <span class="hero-label">New Collection 2024</span>
          <h1>Elevate Your Lifestyle with Premium Quality</h1>
          <p>Discover our curated selection of top-tier products designed to enhance your daily life. Unmatched quality, unbeatable prices.</p>
          <div class="hero-buttons">
            <a routerLink="/products" class="btn btn-primary btn-lg">Shop Now</a>
            <a routerLink="/products" [queryParams]="{sort: 'newest'}" class="btn btn-outline-light btn-lg">View New Arrivals</a>
          </div>
        </div>
      </div>
    </div>

    <div class="container main-container">
      <!-- Features Section -->
      <div class="features-grid grid-3">
        <div class="feature-card">
          <div class="feature-icon">🚀</div>
          <h3>Fast Delivery</h3>
          <p>Free shipping on all orders above ₹499</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🛡️</div>
          <h3>Secure Payment</h3>
          <p>100% secure payment with 256-bit encryption</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">↩️</div>
          <h3>Easy Returns</h3>
          <p>30 days money-back guarantee policy</p>
        </div>
      </div>

      <!-- Featured Products -->
      <div class="section-header">
        <div>
          <span class="section-label">Top Picks</span>
          <h2>Featured Products</h2>
        </div>
        <a routerLink="/products" class="view-all-link">View All Products →</a>
      </div>

      <div class="product-grid">
        <div *ngFor="let product of featuredProducts" class="product-card" [routerLink]="['/product', product.productId]">
          <div class="product-image-container">
            <img [src]="product.imageUrl" [alt]="product.name" class="product-image">
            <div class="product-overlay">
              <button class="btn btn-primary btn-sm">View Details</button>
            </div>
            <span *ngIf="product.discountPrice" class="discount-tag">
              -{{ ((product.price - product.discountPrice) / product.price * 100).toFixed(0) }}%
            </span>
          </div>
          
          <div class="product-info">
            <div class="category-text">{{ product.category?.name || 'General' }}</div>
            <h3 class="product-title">{{ product.name }}</h3>
            
            <div class="product-rating">
              <span class="stars">★★★★☆</span>
              <span class="rating-count">({{ product.rating }})</span>
            </div>
            
            <div class="product-price">
              <span class="current-price">₹{{ product.discountPrice || product.price }}</span>
              <span *ngIf="product.discountPrice" class="original-price">₹{{ product.price }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Newsletter Section -->
      <div class="newsletter-section">
        <div class="newsletter-content">
          <h2>Subscribe to our Newsletter</h2>
          <p>Get the latest updates on new products and upcoming sales</p>
          <div class="newsletter-form">
            <input type="email" placeholder="Enter your email address">
            <button class="btn btn-primary">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Hero Section */
    .hero-section {
      background: linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.6)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80');
      background-size: cover;
      background-position: center;
      color: white;
      padding: 6rem 0;
      margin-bottom: 4rem;
      border-radius: 0 0 50px 50px;
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }

    .hero-label {
      display: inline-block;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #e2e8f0;
      padding: 0.5rem 1.25rem;
      border-radius: 99px;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .hero-content h1 {
      font-size: 3.5rem;
      line-height: 1.2;
      margin-bottom: 1.5rem;
      color: white;
      font-weight: 800;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }

    .hero-content p {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.95);
      margin-bottom: 2.5rem;
      line-height: 1.6;
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    }

    .hero-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .btn-lg {
      padding: 1rem 2rem;
      font-size: 1.1rem;
    }

    .btn-outline-light {
      background: transparent;
      border: 2px solid white;
      color: white;
      transition: all 0.3s ease;
    }

    .btn-outline-light:hover {
      background: white;
      color: var(--primary-color);
    }

    /* Main Container */
    .main-container {
      padding-bottom: 4rem;
    }

    /* Features Grid */
    .features-grid {
      margin-bottom: 5rem;
    }

    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      border: 1px solid var(--border-color);
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      border-color: var(--primary-light);
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      background: var(--bg-secondary);
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      margin: 0 auto 1.5rem;
    }

    .feature-card h3 {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .feature-card p {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin: 0;
    }

    /* Section Header */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2rem;
    }

    .section-label {
      color: var(--secondary-color);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.875rem;
      letter-spacing: 0.05em;
      display: block;
      margin-bottom: 0.5rem;
    }

    .section-header h2 {
      margin: 0;
      color: var(--text-primary);
    }

    .view-all-link {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: gap 0.3s ease;
    }

    .view-all-link:hover {
      gap: 0.75rem;
    }

    /* Product Grid */
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
      margin-bottom: 5rem;
    }

    .product-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid var(--border-color);
      transition: all 0.3s ease;
      position: relative;
      cursor: pointer;
    }

    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .product-card:hover .product-overlay {
      opacity: 1;
    }

    .product-image-container {
      position: relative;
      padding-top: 100%; /* 1:1 Aspect Ratio */
      overflow: hidden;
      background: var(--bg-secondary);
    }

    .product-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 1rem;
      transition: transform 0.5s ease;
    }

    .product-card:hover .product-image {
      transform: scale(1.05);
    }

    .product-overlay {
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

    .discount-tag {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: var(--error-color);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 99px;
      font-size: 0.75rem;
      font-weight: 700;
      z-index: 2;
    }

    .product-info {
      padding: 1.5rem;
    }

    .category-text {
      font-size: 0.75rem;
      color: var(--text-light);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .product-title {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--text-primary);
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .stars {
      color: #fbbf24;
      letter-spacing: 2px;
    }

    .rating-count {
      font-size: 0.85rem;
      color: var(--text-light);
    }

    .product-price {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .current-price {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary-color);
    }

    .original-price {
      text-decoration: line-through;
      color: var(--text-light);
      font-size: 0.9rem;
    }

    /* Newsletter */
    .newsletter-section {
      background: var(--bg-tertiary);
      border-radius: 24px;
      padding: 4rem 2rem;
      text-align: center;
    }

    .newsletter-content {
      max-width: 600px;
      margin: 0 auto;
    }

    .newsletter-content h2 {
      margin-bottom: 1rem;
    }

    .newsletter-form {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .newsletter-form input {
      flex: 1;
      padding: 1rem;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 4rem 0;
        border-radius: 0 0 30px 30px;
      }
      
      .hero h1 {
        font-size: 2.5rem;
      }
      
      .newsletter-form {
        flex-direction: column;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredProducts: any[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getTopRatedProducts().subscribe({
      next: (products) => this.featuredProducts = products.slice(0, 8),
      error: (err) => console.error('Error loading products:', err)
    });
  }
}
