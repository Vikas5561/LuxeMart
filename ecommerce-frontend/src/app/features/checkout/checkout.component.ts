import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-checkout',
  template: `
    <div class="checkout-wrapper">
      <div class="checkout-container">
        <h1 class="page-title">Checkout</h1>
      
        <div class="checkout-layout">
          <!-- Left Section: Address -->
          <div class="left-section">
            <div class="section-card">
              <div class="section-header">
                <h2>📍 Shipping Address</h2>
                <button class="btn-add" (click)="showAddressForm = !showAddressForm">
                  {{ showAddressForm ? '❌ Cancel' : '+ Add New Address' }}
                </button>
              </div>
            
            <!-- Add New Address Form -->
            <div *ngIf="showAddressForm" class="address-form">
              <h3>New Address</h3>
              <div class="form-row">
                <input type="text" [(ngModel)]="newAddress.fullName" placeholder="Full Name *" class="form-input" required>
              </div>
              <div class="form-row">
                <input type="text" [(ngModel)]="newAddress.street" placeholder="Street Address *" class="form-input" required>
              </div>
              <div class="form-row-2">
                <input type="text" [(ngModel)]="newAddress.city" placeholder="City *" class="form-input" required>
                <input type="text" [(ngModel)]="newAddress.state" placeholder="State *" class="form-input" required>
              </div>
              <div class="form-row-2">
                <input type="text" [(ngModel)]="newAddress.zipCode" placeholder="Zip Code *" class="form-input" required>
                <input type="tel" [(ngModel)]="newAddress.phone" placeholder="Phone *" class="form-input" required>
              </div>
              <div class="form-row">
                <input type="text" [(ngModel)]="newAddress.country" placeholder="Country *" class="form-input" required>
              </div>
              <div class="form-row">
                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="newAddress.isDefault">
                  <span>Set as default address</span>
                </label>
              </div>
              <button class="btn-save" (click)="saveAddress()">
                💾 Save Address
              </button>
            </div>
            
            <!-- Saved Addresses Grid -->
            <div *ngIf="addresses.length > 0" class="addresses-grid">
              <div *ngFor="let address of addresses" 
                   class="address-card" 
                   [class.selected]="selectedAddress?.addressId === address.addressId"
                   (click)="selectAddress(address)">
                <div class="address-header">
                  <h4>{{ address.fullName }}</h4>
                  <span *ngIf="address.isDefault" class="default-badge">Default</span>
                </div>
                <p class="address-line">{{ address.street }}</p>
                <p class="address-line">{{ address.city }}, {{ address.state }} - {{ address.zipCode }}</p>
                <p class="address-line">📞 {{ address.phone }}</p>
                <div *ngIf="selectedAddress?.addressId === address.addressId" class="selected-check">✓ Selected</div>
              </div>
            </div>
            <div *ngIf="addresses.length === 0 && !showAddressForm" class="empty-state">
              <p>📦 No addresses found. Please add an address first.</p>
            </div>
          </div>
        </div>

        <!-- Right Section: Order Summary -->
        <div class="right-section">
          <div class="section-card summary-card">
            <h2>🛒 Order Summary</h2>
            
            <div class="cart-items">
              <div *ngFor="let item of cart?.items" class="cart-item">
                <div class="item-info-container">
                  <div class="item-image">
                    <img [src]="item.product.imageUrl || 'assets/placeholder.jpg'" alt="{{ item.product.name }}">
                  </div>
                  <div class="item-info">
                    <span class="item-name">{{ item.product.name }}</span>
                    <span class="item-qty">x{{ item.quantity }}</span>
                  </div>
                </div>
                <span class="item-price">₹{{ item.price * item.quantity }}</span>
              </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="summary-row">
              <span>Subtotal:</span>
              <span class="amount">₹{{ cart?.totalPrice || 0 }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping:</span>
              <span class="amount free">FREE</span>
            </div>
            
            <div class="summary-row" *ngIf="cart?.discountAmount > 0">
              <span>Discount:</span>
              <span class="amount text-success">-₹{{ cart?.discountAmount | number:'1.2-2' }}</span>
            </div>
            
            <div class="divider"></div>
            
            <div class="summary-row total">
              <span>Total:</span>
              <span class="amount">₹{{ (cart?.totalPrice - (cart?.discountAmount || 0)) | number:'1.2-2' }}</span>
            </div>
            
            <button class="btn-proceed" (click)="proceedToPayment()" [disabled]="!selectedAddress">
              {{ selectedAddress ? '🚀 Proceed to Payment' : '⚠️ Select Address First' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-wrapper {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .checkout-container {
      min-height: calc(100vh - 2rem);
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-radius: 20px;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.05);
    }

    .page-title {
      color: white;
      font-size: 2.5rem;
      margin-bottom: 2rem;
      text-align: center;
      text-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }

    .checkout-layout {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .section-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      height: 100%;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header h2, .summary-card h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #2d3748;
    }

    .btn-add {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .btn-add:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .address-form {
      background: #f7fafc;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      border: 1px solid #e2e8f0;
    }

    .address-form h3 {
      margin: 0 0 1rem 0;
      color: #2d3748;
    }

    .form-row {
      margin-bottom: 1rem;
    }

    .form-row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      background: white;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.95rem;
      color: #4a5568;
    }

    .btn-save {
      width: 100%;
      background: #48bb78;
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-save:hover {
      background: #38a169;
      transform: translateY(-2px);
    }

    .addresses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .address-card {
      background: #f7fafc;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.25rem;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
    }

    .address-card:hover {
      border-color: #667eea;
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
    }

    .address-card.selected {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }

    .address-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .address-header h4 {
      margin: 0;
      font-size: 1.1rem;
      color: #2d3748;
    }

    .default-badge {
      background: #667eea;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .address-line {
      margin: 0.5rem 0;
      color: #4a5568;
      font-size: 0.95rem;
    }

    .selected-check {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #48bb78;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #718096;
    }

    .item-info-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .item-image img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }

    .item-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .cart-items { margin-bottom: 1.5rem; }
    
    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f7fafc;
      border-radius: 8px;
      margin-bottom: 0.75rem;
    }
    
    .item-name { font-weight: 600; color: #2d3748; }
    .item-qty { font-size: 0.9rem; color: #718096; }
    .item-price { font-weight: 700; color: #667eea; font-size: 1.1rem; }
    
    .divider { height: 1px; background: #e2e8f0; margin: 1.5rem 0; }
    
    .summary-row {
      display: flex; justify-content: space-between; padding: 0.75rem 0;
      font-size: 1rem; color: #4a5568;
    }
    
    .summary-row.total {
      font-size: 1.5rem; font-weight: 700; color: #2d3748; padding-top: 1rem;
    }
    
    .amount { font-weight: 600; color: #2d3748; }
    .amount.free { color: #48bb78; font-weight: 700; }
    .text-success { color: #48bb78; }
    
    .btn-proceed {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white; border: none; padding: 1.25rem; border-radius: 12px;
      font-size: 1.2rem; font-weight: 700; cursor: pointer; margin-top: 1.5rem;
      transition: all 0.3s;
    }
    
    .btn-proceed:active { transform: scale(0.98); }
    .btn-proceed:disabled { background: #cbd5e0; cursor: not-allowed; transform: none; box-shadow: none; }

    @media (max-width: 968px) {
      .checkout-layout {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cart: any = null;
  addresses: any[] = [];
  selectedAddress: any = null;
  showAddressForm = false;
  newAddress: any = {
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    country: 'India',
    isDefault: false
  };

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCart();
    this.loadAddresses();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (cart) => this.cart = cart,
      error: (err) => console.error('Error loading cart:', err)
    });
  }

  loadAddresses() {
    this.userService.getAddresses().subscribe({
      next: (addresses) => {
        this.addresses = addresses;
        if (this.addresses.length > 0) {
          this.selectedAddress = addresses.find((a: any) => a.isDefault) || addresses[0];
        } else {
          // If no addresses, fetch profile to get registration address
          this.userService.getProfile().subscribe({
            next: (userProfile) => {
              this.autoAddDefaultAddress(userProfile);
            },
            error: (err) => {
              console.error('Error loading profile for address:', err);
              this.showAddressForm = true;
            }
          });
        }
      },
      error: (err) => console.error('Error loading addresses:', err)
    });
  }

  autoAddDefaultAddress(user: any) {
    // Check for address1 from profile (registration data)
    if (user && user.address1 && user.city && user.zipCode) {
      const defaultAddress = {
        fullName: user.firstName ? `${user.firstName} ${user.lastName}` : user.name || 'Valued Customer',
        street: user.address1,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        phone: user.phone,
        country: user.country || 'India',
        isDefault: true
      };

      console.log('Auto-adding default address from profile...', defaultAddress);

      this.userService.addAddress(defaultAddress).subscribe({
        next: (savedAddress) => {
          this.addresses.push(savedAddress);
          this.selectedAddress = savedAddress;
        },
        error: (err) => {
          console.error('Failed to auto-add default address:', err);
          this.prefillAddressFromProfile(user);
        }
      });
    } else {
      this.prefillAddressFromProfile(user);
    }
  }

  prefillAddressFromProfile(userProfile: any = null) {
    const user = userProfile || this.authService.getCurrentUser();
    if (user) {
      this.newAddress = {
        fullName: user.firstName ? `${user.firstName} ${user.lastName}` : user.name || '',
        street: user.address1 || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        phone: user.phone || '',
        country: user.country || 'India',
        isDefault: false
      };
      this.showAddressForm = true;
    }
  }

  selectAddress(address: any) {
    this.selectedAddress = address;
  }

  saveAddress() {
    if (!this.newAddress.fullName || !this.newAddress.street || !this.newAddress.city ||
      !this.newAddress.state || !this.newAddress.zipCode || !this.newAddress.phone || !this.newAddress.country) {
      alert('Please fill all required fields');
      return;
    }

    this.userService.addAddress(this.newAddress).subscribe({
      next: (savedAddress) => {
        this.addresses.push(savedAddress);
        if (this.newAddress.isDefault || this.addresses.length === 1) {
          this.selectedAddress = savedAddress;
        }
        // Reset form
        this.newAddress = { fullName: '', street: '', city: '', state: '', zipCode: '', phone: '', country: 'India', isDefault: false };
        this.showAddressForm = false;
        alert('Address saved successfully!');
      },
      error: (err) => {
        console.error('Error saving address:', err);
        alert('Failed to save address. Please try again.');
      }
    });
  }

  proceedToPayment() {
    if (!this.selectedAddress) {
      alert('Please select a shipping address');
      return;
    }
    this.router.navigate(['/customer/payment'], {
      state: {
        addressId: this.selectedAddress.addressId,
        total: this.cart.totalPrice - (this.cart.discountAmount || 0),
        cartItems: this.cart.items,
        subtotal: this.cart.totalPrice,
        discount: this.cart.discountAmount || 0
      }
    });
  }


}
