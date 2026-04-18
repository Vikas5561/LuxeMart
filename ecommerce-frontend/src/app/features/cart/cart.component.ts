import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CouponService } from '../../core/services/coupon.service';

@Component({
  selector: 'app-cart',
  template: `
    <div class="cart-wrapper">
      <div class="container">
        <!-- Header -->
        <div class="cart-header fade-in">
          <h1>Shopping Cart</h1>
          <p class="cart-count">{{ cart?.items?.length || 0 }} items</p>
        </div>
        
        <div *ngIf="cart && cart.items.length > 0; else emptyCart" class="cart-grid fade-in">
          <!-- Left Section: Cart Items -->
          <div class="cart-items-section">
            <div class="cart-items-list">
              <div class="cart-item" *ngFor="let item of cart.items">
                <div class="item-image-wrapper">
                  <img [src]="item.product.imageUrl" [alt]="item.product.name" class="product-image">
                </div>
                
                <div class="item-content">
                  <div class="item-header">
                    <h3 class="product-name" [routerLink]="['/product', item.product.productId]">{{ item.product.name }}</h3>
                    <button (click)="removeItem(item)" class="btn-remove-icon" title="Remove Item">×</button>
                  </div>
                  
                  <p class="product-category">{{ item.product.category?.name }}</p>
                  
                  <div class="item-controls">
                    <div class="quantity-control">
                      <button (click)="updateQuantity(item, item.quantity - 1)" 
                              [disabled]="item.quantity <= 1" class="qty-btn">−</button>
                      <span class="qty-val">{{ item.quantity }}</span>
                      <button (click)="updateQuantity(item, item.quantity + 1)" 
                              [disabled]="item.quantity >= item.product.quantityAvailable" class="qty-btn">+</button>
                    </div>
                    
                    <div class="item-pricing">
                      <p class="unit-price">₹{{ item.price | number:'1.0-0' }}</p>
                      <p class="total-price">₹{{ item.price * item.quantity | number:'1.0-0' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="continue-shopping">
              <a routerLink="/products" class="btn-link">← Continue Shopping</a>
            </div>
          </div>

          <!-- Right Section: Summary -->
          <div class="cart-summary-section">
            <div class="summary-card sticky-summary">
              <h2>Order Summary</h2>
              
              <div class="coupon-section">
                <div class="coupon-input-wrapper">
                  <input type="text" [(ngModel)]="couponCode" placeholder="Promo Code" class="coupon-input">
                  <button (click)="applyCoupon()" class="btn-apply" [disabled]="!couponCode">Apply</button>
                </div>
                <p *ngIf="couponMessage" 
                   [class.text-success]="couponApplied" 
                   [class.text-error]="!couponApplied" 
                   class="coupon-msg">{{ couponMessage }}</p>
              </div>

              <div class="summary-details">
                <div class="summary-row">
                  <span>Subtotal</span>
                  <span>₹{{ cart.totalPrice | number:'1.2-2' }}</span>
                </div>
                <div class="summary-row">
                  <span>Shipping</span>
                  <span class="text-success">Free</span>
                </div>
                <div class="summary-row" *ngIf="discount > 0">
                  <span>Discount</span>
                  <span class="text-success">-₹{{ discount | number:'1.2-2' }}</span>
                </div>
                <div class="divider"></div>
                <div class="summary-row total">
                  <span>Total</span>
                  <span>₹{{ cart.totalPrice - discount | number:'1.2-2' }}</span>
                </div>
              </div>

              <div class="checkout-actions">
                <button routerLink="/checkout" class="btn btn-primary btn-block btn-lg">
                  Proceed to Checkout
                </button>
                <div class="secure-checkout">
                  <span>🔒 Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty Cart State -->
        <ng-template #emptyCart>
          <div class="empty-cart-state fade-in">
            <div class="empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't made your choice yet.</p>
            <a routerLink="/products" class="btn btn-primary btn-lg mt-4">Start Shopping</a>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .cart-wrapper {
      min-height: 100vh;
      background-color: var(--bg-secondary);
      padding: 2rem 0 4rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .cart-header {
      display: flex;
      align-items: baseline;
      gap: 1rem;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    .cart-header h1 {
      font-size: 2rem;
      color: var(--text-primary);
      margin: 0;
    }

    .cart-count {
      color: var(--text-secondary);
      font-size: 1.1rem;
      font-weight: 500;
    }

    .cart-grid {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 2rem;
    }

    /* Cart Items */
    .cart-items-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .cart-item {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      gap: 1.5rem;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .cart-item:hover {
      box-shadow: var(--shadow-md);
    }

    .item-image-wrapper {
        width: 120px;
        height: 120px;
        background: #f8fafc;
        border-radius: 12px;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .product-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .item-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.25rem;
    }

    .product-name {
      font-size: 1.1rem;
      color: var(--text-primary);
      margin: 0;
      font-weight: 600;
      cursor: pointer;
      transition: color 0.2s;
    }
    .product-name:hover {
        color: var(--primary-color);
    }

    .btn-remove-icon {
      background: none;
      border: none;
      font-size: 1.5rem;
      line-height: 1;
      color: #cbd5e0;
      cursor: pointer;
      padding: 0;
      transition: color 0.2s;
    }
    .btn-remove-icon:hover {
      color: #ef4444;
    }

    .product-category {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin: 0 0 1rem 0;
    }

    .item-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .quantity-control {
      display: flex;
      align-items: center;
      background: #f1f5f9;
      border-radius: 8px;
      padding: 0.25rem;
    }

    .qty-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: white;
      border-radius: 6px;
      font-weight: 600;
      color: var(--text-primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      transition: transform 0.1s;
    }

    .qty-btn:active:not(:disabled) {
        transform: scale(0.95);
    }

    .qty-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .qty-val {
      width: 40px;
      text-align: center;
      font-weight: 600;
      font-size: 1rem;
      color: var(--text-primary);
    }

    .item-pricing {
        text-align: right;
    }

    .unit-price {
        font-size: 0.85rem;
        color: var(--text-secondary);
        margin: 0;
    }

    .total-price {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
    }

    .continue-shopping {
        margin-top: 2rem;
    }
    .btn-link {
        color: var(--text-secondary);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;
    }
    .btn-link:hover {
        color: var(--primary-color);
    }

    /* Summary Section */
    .sticky-summary {
      position: sticky;
      top: 2rem;
    }

    .summary-card {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-color);
    }

    .summary-card h2 {
      font-size: 1.25rem;
      color: var(--text-primary);
      margin: 0 0 1.5rem 0;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    .coupon-section {
        margin-bottom: 2rem;
    }

    .coupon-input-wrapper {
        display: flex;
        gap: 0.5rem;
    }

    .coupon-input {
        flex: 1;
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        font-size: 0.95rem;
        transition: border-color 0.2s;
    }
    .coupon-input:focus {
        outline: none;
        border-color: var(--primary-color);
    }

    .btn-apply {
        padding: 0.75rem 1.25rem;
        background: var(--text-primary);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
    }
    .btn-apply:hover:not(:disabled) {
        background: black;
    }
    .btn-apply:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .coupon-msg {
        font-size: 0.85rem;
        margin: 0.5rem 0 0;
    }
    .text-success { color: #166534; }
    .text-error { color: #991b1b; }

    .summary-details {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .summary-row {
        display: flex;
        justify-content: space-between;
        color: var(--text-secondary);
        font-size: 1rem;
    }

    .summary-row.total {
        color: var(--text-primary);
        font-weight: 700;
        font-size: 1.25rem;
    }

    .divider {
        height: 1px;
        background: var(--border-color);
        margin: 0.5rem 0;
    }

    .btn-block {
        width: 100%;
        display: block;
    }
    
    .btn-lg {
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 12px;
    }

    .secure-checkout {
        text-align: center;
        margin-top: 1rem;
        color: var(--text-secondary);
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    /* Empty State */
    .empty-cart-state {
      text-align: center;
      padding: 4rem 1rem;
      background: white;
      border-radius: 24px;
      box-shadow: var(--shadow-sm);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      background: #f1f5f9;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }

    .empty-cart-state h2 {
        color: var(--text-primary);
        margin-bottom: 0.5rem;
    }
    .empty-cart-state p {
        color: var(--text-secondary);
        margin-bottom: 2rem;
    }

    @media (max-width: 900px) {
      .cart-grid {
        grid-template-columns: 1fr;
      }
      .sticky-summary {
          position: static;
      }
    }
    
    @media (max-width: 600px) {
        .cart-item {
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
        .item-controls {
            flex-direction: column;
            gap: 1rem;
            width: 100%;
        }
        .item-pricing {
            text-align: center;
        }
        .item-header {
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
        }
    }
  `]
})
export class CartComponent implements OnInit {
  cart: any = null;
  couponCode: string = '';
  couponApplied: boolean = false;
  couponMessage: string = '';
  discount: number = 0;

  constructor(
    private cartService: CartService,
    private couponService: CouponService
  ) { }

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        if (cart && (cart.discountAmount || 0) > 0) {
          this.discount = cart.discountAmount || 0;
          this.couponCode = cart.couponCode || '';
          this.couponApplied = true;
          this.couponMessage = 'Coupon applied successfully!';
        } else {
          // If cart loaded without discount, clear local state
          // This ensures we don't show a discount that isn't persisted
          this.discount = 0;
          this.couponApplied = false;
        }
      },
      error: (err) => console.error('Error loading cart:', err)
    });
  }

  updateQuantity(item: any, newQuantity: number) {
    if (newQuantity < 1) return;
    this.cartService.updateCartItem(item.cartItemId, newQuantity).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Error updating cart:', err)
    });
  }

  removeItem(item: any) {
    this.cartService.removeFromCart(item.cartItemId).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Error removing item:', err)
    });
  }

  applyCoupon() {
    if (!this.couponCode.trim()) {
      this.couponMessage = 'Please enter a coupon code';
      this.couponApplied = false;
      return;
    }

    this.couponService.validateCoupon(this.couponCode, this.cart.totalPrice).subscribe({
      next: (result) => {
        if (result.valid) {
          this.couponApplied = true;
          this.discount = result.discount;
          this.couponMessage = result.message || 'Coupon applied successfully!';
          this.loadCart(); // Reload cart to get persisted discount
        } else {
          this.couponApplied = false;
          this.discount = 0;
          this.couponMessage = result.message || 'Invalid coupon code';
        }
      },
      error: (err) => {
        this.couponApplied = false;
        this.discount = 0;
        this.couponMessage = 'Error applying coupon';
      }
    });
  }
}
