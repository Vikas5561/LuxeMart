import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ReviewService } from '../../core/services/review.service';

@Component({
  selector: 'app-product-detail',
  template: `
    <div class="container main-container" *ngIf="product">
      <nav class="breadcrumb fade-in">
        <a routerLink="/">Home</a> <span class="separator">/</span>
        <a routerLink="/products">Products</a> <span class="separator">/</span>
        <span class="current">{{ product.name }}</span>
      </nav>

      <div class="product-detail-card fade-in">
        <!-- Left Column: Image -->
        <div class="product-image-section">
          <div class="image-wrapper">
             <span class="badge badge-category">{{ product.category?.name }}</span>
            <img [src]="product.imageUrl" [alt]="product.name" class="main-image">
          </div>
        </div>

        <!-- Right Column: Info -->
        <div class="product-info-section">
          <div class="product-header">
            <h1 class="product-title">{{ product.name }}</h1>
            <div class="product-meta-top">
               <div class="rating-badge">
                <span>⭐ {{ product.rating }}</span>
                <span class="review-count">({{ product.reviewCount }} reviews)</span>
              </div>
              <div class="stock-status" [class.in-stock]="product.quantityAvailable > 0" [class.out-of-stock]="product.quantityAvailable === 0">
                <span class="status-dot"></span>
                {{ product.quantityAvailable > 0 ? 'In Stock' : 'Out of Stock' }}
              </div>
            </div>
          </div>

          <div class="price-section">
            <div class="price-box">
              <span class="current-price">₹{{ product.discountPrice || product.price | number:'1.0-0' }}</span>
              <span *ngIf="product.discountPrice" class="original-price">₹{{ product.price | number:'1.0-0' }}</span>
            </div>
            <span *ngIf="product.discountPrice" class="discount-badge">
              {{ ((product.price - product.discountPrice) / product.price * 100).toFixed(0) }}% OFF
            </span>
          </div>

          <div class="description-section">
              <h3>Description</h3>
              <p class="description">{{ product.description }}</p>
          </div>

          <div class="purchase-actions" *ngIf="product.quantityAvailable > 0">
            <div class="quantity-control">
              <label>Quantity</label>
              <div class="quantity-selector">
                <button (click)="updateQuantity(-1)" [disabled]="quantity <= 1" class="qty-btn">-</button>
                <input type="number" [(ngModel)]="quantity" min="1" [max]="product.quantityAvailable" readonly class="qty-input">
                <button (click)="updateQuantity(1)" [disabled]="quantity >= product.quantityAvailable" class="qty-btn">+</button>
              </div>
            </div>
             <p class="stock-count" *ngIf="product.quantityAvailable < 10">Only {{ product.quantityAvailable }} left!</p>
          </div>

          <div class="action-buttons">
            <button (click)="addToCart()" [disabled]="product.quantityAvailable === 0" class="btn btn-primary btn-lg btn-add-cart">
              <span class="icon">🛒</span> Add To Cart
            </button>
            <button (click)="toggleWishlist()" class="btn btn-outline btn-lg btn-wishlist" [class.active]="inWishlist">
              <span class="icon">{{ inWishlist ? '❤️' : '🤍' }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="content-section mt-5 fade-in">
        <div class="section-header">
             <h2>Customer Reviews</h2>
        </div>
       
        <div class="reviews-grid" *ngIf="reviews.length > 0; else noReviews">
          <div *ngFor="let review of reviews" class="review-card">
            <div class="review-header">
              <div class="reviewer-info">
                <div class="avatar">{{ review.user?.firstName?.charAt(0) }}</div>
                <div>
                  <span class="reviewer-name">{{ review.user?.firstName }} {{ review.user?.lastName }}</span>
                  <span class="review-date">{{ review.createdAt | date:'mediumDate' }}</span>
                </div>
              </div>
              <div class="rating-stars">
                <span *ngFor="let s of [1,2,3,4,5]" [class.filled]="s <= review.rating">★</span>
              </div>
            </div>
            <p class="review-comment">{{ review.comment }}</p>
          </div>
        </div>
        <ng-template #noReviews>
          <div class="empty-reviews">
            <p>No reviews yet. Be the first to share your thoughts!</p>
          </div>
        </ng-template>
      </div>

      <div class="content-section mt-5 fade-in" *ngIf="relatedProducts.length > 0">
        <div class="section-header">
            <h2>You May Also Like</h2>
        </div>
        <div class="products-grid">
          <div *ngFor="let p of relatedProducts" class="related-product-card" [routerLink]="['/product', p.productId]">
            <div class="related-img-wrapper">
              <img [src]="p.imageUrl" [alt]="p.name">
            </div>
            <div class="related-card-body">
              <h4>{{ p.name }}</h4>
              <div class="flex-between">
                <span class="price">₹{{ p.discountPrice || p.price | number:'1.0-0' }}</span>
                <span class="rating-mini">★ {{ p.rating }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .main-container {
      padding-top: 2rem;
      padding-bottom: 4rem;
    }
    
    .breadcrumb {
      margin-bottom: 1.5rem;
      color: var(--text-secondary);
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .breadcrumb a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.2s;
    }
    .breadcrumb a:hover {
      color: var(--primary-color);
    }
    .breadcrumb .separator {
        color: var(--text-light);
    }
    .breadcrumb .current {
      color: var(--text-primary);
      font-weight: 500;
    }

    /* Product Card Layout */
    .product-detail-card {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      background: white;
      border-radius: 24px;
      padding: 2.5rem;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-color);
      align-items: start;
    }

    /* Left Column */
    .product-image-section {
    }

    .image-wrapper {
        position: relative;
        background: #f8fafc;
        border-radius: 16px;
        padding: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--border-color);
        min-height: 400px;
    }

    .badge-category {
      position: absolute;
      top: 1.5rem;
      left: 1.5rem;
      background: rgba(255, 255, 255, 0.9);
      color: var(--primary-color);
      padding: 0.35rem 1rem;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 600;
      z-index: 1;
      backdrop-filter: blur(4px);
      box-shadow: var(--shadow-sm);
    }

    .main-image {
      width: 100%;
      height: auto;
      max-height: 500px;
      object-fit: contain;
      mix-blend-mode: multiply;
    }

    /* Right Column */
    .product-info-section {
      padding-top: 1rem;
    }

    .product-title {
        font-size: 2.5rem;
        color: var(--text-primary);
        margin: 0 0 1rem 0;
        line-height: 1.2;
        font-weight: 800;
    }

    .product-meta-top {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .rating-badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #fffbeb;
        color: #b45309;
        padding: 0.35rem 0.75rem;
        border-radius: 8px;
        font-weight: 600;
    }
    .review-count {
        color: #92400e;
        font-weight: 400;
        font-size: 0.9rem;
    }

    .stock-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      font-size: 0.9rem;
      padding: 0.35rem 0.75rem;
      border-radius: 8px;
    }
    .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }
    .in-stock { 
        background-color: #f0fdf4;
        color: #166534; 
    }
    .in-stock .status-dot { background-color: #166534; }

    .out-of-stock { 
        background-color: #fef2f2;
        color: #991b1b; 
    }
    .out-of-stock .status-dot { background-color: #991b1b; }


    .price-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border-color);
    }

    .price-box {
        display: flex;
        align-items: baseline;
        gap: 1rem;
    }

    .current-price {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--text-primary);
    }

    .original-price {
      font-size: 1.5rem;
      color: var(--text-secondary);
      text-decoration: line-through;
    }

    .discount-badge {
      background: #fee2e2;
      color: #991b1b;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .description-section h3 {
        font-size: 1.1rem;
        margin-bottom: 0.75rem;
        color: var(--text-primary);
    }

    .description {
      color: var(--text-secondary);
      line-height: 1.7;
      margin-bottom: 2.5rem;
      font-size: 1.05rem;
    }

    /* Actions */
    .purchase-actions {
      margin-bottom: 2rem;
    }

    .quantity-control label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--text-primary);
        font-size: 0.9rem;
    }

    .quantity-selector {
      display: inline-flex;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
      background: white;
    }

    .qty-btn {
      width: 44px;
      height: 44px;
      border: none;
      background: white;
      font-weight: 600;
      color: var(--text-primary);
      cursor: pointer;
      transition: background 0.2s;
      font-size: 1.2rem;
    }

    .qty-btn:hover:not(:disabled) {
      background: #f8fafc;
      color: var(--primary-color);
    }

    .qty-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .qty-input {
      width: 60px;
      border: none;
      border-left: 1px solid var(--border-color);
      border-right: 1px solid var(--border-color);
      text-align: center;
      font-weight: 600;
      font-size: 1.1rem;
      color: var(--text-primary);
      -moz-appearance: textfield;
    }
    .qty-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    
    .stock-count {
        margin-top: 0.5rem;
        color: #d97706;
        font-size: 0.9rem;
        font-weight: 500;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
    }

    .btn-lg {
      padding: 1rem 2rem;
      font-size: 1.1rem;
      border-radius: 12px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .btn-add-cart {
        flex: 1;
        transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-add-cart:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(26, 54, 93, 0.2);
    }

    .btn-wishlist {
      width: 56px;
      padding: 0;
      border: 1px solid var(--border-color);
      color: var(--text-primary);
    }
    .btn-wishlist:hover {
        border-color: var(--primary-color);
        background: #f0f9ff;
    }
    .btn-wishlist.active {
      background: #fee2e2;
      border-color: #fecaca;
    }

    /* Content Sections */
    .content-section {
        background: white;
        border-radius: 24px;
        padding: 2.5rem;
        border: 1px solid var(--border-color);
        margin-top: 3rem;
    }

    .section-header {
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-color);
    }
    
    .section-header h2 {
        margin: 0;
        font-size: 1.5rem;
        color: var(--text-primary);
    }

    /* Reviews Grid */
    .reviews-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .review-card {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 16px;
      border: 1px solid var(--border-color);
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .reviewer-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.1rem;
    }

    .reviewer-name {
        display: block;
        font-weight: 600;
        color: var(--text-primary);
        font-size: 0.95rem;
    }

    .review-date {
        color: var(--text-secondary);
        font-size: 0.8rem;
    }

    .rating-stars {
        color: #cbd5e0;
        font-size: 1rem;
    }
    .rating-stars .filled { color: #f59e0b; }

    .review-comment {
        margin: 0;
        color: var(--text-secondary);
        line-height: 1.5;
    }
    
    .empty-reviews {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
        font-style: italic;
    }

    /* Related Products Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.5rem;
    }

    .related-product-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--border-color);
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }

    .related-product-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
    }

    .related-img-wrapper {
      height: 180px;
      background: white;
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid var(--border-color);
    }

    .related-img-wrapper img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .related-card-body {
      padding: 1rem;
    }

    .related-card-body h4 {
      font-size: 1rem;
      margin: 0 0 0.5rem 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--text-primary);
    }

    .rating-mini {
        font-size: 0.85rem;
        color: #b45309;
        font-weight: 600;
    }

    @media (max-width: 900px) {
      .product-detail-card {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .image-wrapper {
        min-height: 300px;
      }
      
      .product-title {
          font-size: 2rem;
      }
    }
    
    @media (max-width: 600px) {
        .product-meta-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  reviews: any[] = [];
  relatedProducts: any[] = [];
  inWishlist = false;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private reviewService: ReviewService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadProduct(id);
      this.loadReviews(id);
      this.checkWishlist(id);
    });
  }

  loadProduct(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.quantity = 1; // Reset quantity on product load
        this.loadRelatedProducts(product.category?.categoryId);
      },
      error: (err) => console.error('Error loading product:', err)
    });
  }

  loadReviews(productId: number) {
    this.reviewService.getProductReviews(productId).subscribe({
      next: (reviews) => this.reviews = reviews,
      error: (err) => console.error('Error loading reviews:', err)
    });
  }

  loadRelatedProducts(categoryId: number) {
    if (!categoryId) return;
    this.productService.getProductsByCategory(String(categoryId)).subscribe({
      next: (products) => {
        this.relatedProducts = products
          .filter(p => p.productId !== this.product.productId)
          .slice(0, 4);
      }
    });
  }

  checkWishlist(productId: number) {
    this.wishlistService.checkInWishlist(productId).subscribe({
      next: (result) => this.inWishlist = result.inWishlist,
      error: () => this.inWishlist = false
    });
  }

  updateQuantity(change: number) {
    const newQty = this.quantity + change;
    if (newQty >= 1 && newQty <= this.product.quantityAvailable) {
      this.quantity = newQty;
    }
  }

  addToCart() {
    this.cartService.addToCart(this.product.productId, this.quantity).subscribe({
      next: () => alert('Added to cart successfully!'),
      error: (err) => {
        if (err.status === 401) {
          alert('Please login to add items to cart');
        } else if (err.error && err.error.error) {
          // Backend returns { error: "message" }
          alert(err.error.error);
        } else {
          alert('Failed to add to cart. Please try again.');
        }
      }
    });
  }

  toggleWishlist() {
    if (this.inWishlist) {
      this.wishlistService.removeFromWishlist(this.product.productId).subscribe({
        next: () => {
          this.inWishlist = false;
          alert('Removed from wishlist');
        }
      });
    } else {
      this.wishlistService.addToWishlist(this.product.productId).subscribe({
        next: () => {
          this.inWishlist = true;
          alert('Added to wishlist');
        },
        error: () => alert('Please login to add to wishlist')
      });
    }
  }
}
