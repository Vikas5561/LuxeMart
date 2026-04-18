import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-payment',
  template: `
    <div class="checkout-container">
      <div class="container">
        <!-- Breadcrumb / Header -->
        <div class="checkout-header">
          <h1>Complete Your Purchase</h1>
        </div>

        <div class="checkout-layout">
          <!-- Left Column: Payment Methods & Address -->
          <div class="checkout-main">
            <!-- Shipping Address Summary -->
            <div class="checkout-card address-card">
              <div class="card-header">
                <h2>📍 Shipping Address</h2>
              </div>
              <div class="address-details" *ngIf="addressId">
                <p class="text-secondary">Address ID: {{addressId}}</p>
                <p class="text-secondary">Standard Delivery (3-5 Days)</p>
              </div>
            </div>

            <!-- Payment Methods -->
            <div class="checkout-card">
              <div class="card-header">
                <h2>💳 Payment Method</h2>
              </div>
              
              <div class="payment-methods-grid">
                <!-- Card Option -->
                <div class="payment-option" 
                     [class.selected]="selectedMethod === 'CARD'"
                     (click)="selectMethod('CARD')">
                  <div class="option-icon">💳</div>
                  <div class="option-details">
                    <h3>Credit/Debit Card</h3>
                    <p>Visa, Mastercard, RuPay</p>
                  </div>
                  <div class="radio-indicator"></div>
                </div>

                <!-- UPI Option -->
                <div class="payment-option"
                     [class.selected]="selectedMethod === 'UPI'"
                     (click)="selectMethod('UPI')">
                  <div class="option-icon">📱</div>
                  <div class="option-details">
                    <h3>UPI</h3>
                    <p>Google Pay, PhonePe, Paytm</p>
                  </div>
                  <div class="radio-indicator"></div>
                </div>

                <!-- Net Banking Option -->
                <div class="payment-option"
                     [class.selected]="selectedMethod === 'NET_BANKING'"
                     (click)="selectMethod('NET_BANKING')">
                  <div class="option-icon">🏦</div>
                  <div class="option-details">
                    <h3>Net Banking</h3>
                    <p>HDFC, SBI, ICICI, Axis & more</p>
                  </div>
                  <div class="radio-indicator"></div>
                </div>

                <!-- COD Option -->
                <div class="payment-option"
                     [class.selected]="selectedMethod === 'COD'"
                     (click)="selectMethod('COD')">
                  <div class="option-icon">💵</div>
                  <div class="option-details">
                    <h3>Cash on Delivery</h3>
                    <p>Pay when you receive</p>
                  </div>
                  <div class="radio-indicator"></div>
                </div>
              </div>

              <!-- Card Entry Form (Simulated) -->
              <div *ngIf="selectedMethod === 'CARD'" class="card-form-container fade-in">
                <form [formGroup]="cardForm" class="card-form">
                  <div class="form-group full-width">
                    <label>Card Number</label>
                    <div class="input-with-icon">
                      <span class="icon">🔢</span>
                      <input type="text" formControlName="cardNumber" maxlength="16" placeholder="0000 0000 0000 0000"
                             [class.is-invalid]="f['cardNumber'].invalid && f['cardNumber'].touched">
                    </div>
                    <div class="invalid-feedback" *ngIf="f['cardNumber'].invalid && f['cardNumber'].touched">
                      Enter a valid 16-digit card number
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>Expiry Date</label>
                       <div class="input-with-icon">
                        <span class="icon">📅</span>
                        <input type="text" formControlName="expiry" placeholder="MM/YY" maxlength="5"
                               [class.is-invalid]="f['expiry'].invalid && f['expiry'].touched">
                      </div>
                      <div class="invalid-feedback" *ngIf="f['expiry'].errors?.['required'] && f['expiry'].touched">
                        Expiry date is required
                      </div>
                      <div class="invalid-feedback" *ngIf="f['expiry'].errors?.['pattern'] && f['expiry'].touched">
                        Format: MM/YY
                      </div>
                      <div class="invalid-feedback" *ngIf="f['expiry'].errors?.['pastDate'] && f['expiry'].touched">
                        Card has expired
                      </div>
                    </div>
                    <div class="form-group">
                      <label>CVV</label>
                       <div class="input-with-icon">
                        <span class="icon">🔒</span>
                        <input type="password" formControlName="cvv" maxlength="3" placeholder="123"
                               [class.is-invalid]="f['cvv'].invalid && f['cvv'].touched">
                      </div>
                      <div class="invalid-feedback" *ngIf="f['cvv'].invalid && f['cvv'].touched">
                        Enter 3-digit CVV
                      </div>
                    </div>
                  </div>

                  <div class="form-group full-width">
                    <label>Name on Card</label>
                     <div class="input-with-icon">
                      <span class="icon">👤</span>
                      <input type="text" formControlName="name" placeholder="John Doe"
                             [class.is-invalid]="f['name'].invalid && f['name'].touched">
                    </div>
                    <div class="invalid-feedback" *ngIf="f['name'].invalid && f['name'].touched">
                      Name is required
                    </div>
                  </div>
                </form>
              </div>

              <!-- UPI Form -->
              <div *ngIf="selectedMethod === 'UPI'" class="card-form-container fade-in">
                <form [formGroup]="upiForm" class="card-form">
                  <div class="form-group full-width">
                    <label>UPI ID</label>
                    <div class="input-with-icon">
                      <span class="icon">📱</span>
                      <input type="text" formControlName="upiId" placeholder="username&#64;upi"
                             [class.is-invalid]="fUpi['upiId'].invalid && fUpi['upiId'].touched">
                    </div>
                    <div class="invalid-feedback" *ngIf="fUpi['upiId'].invalid && fUpi['upiId'].touched">
                      Enter a valid UPI ID (e.g., user&#64;bank)
                    </div>
                  </div>
                  <div class="upi-info">
                    <p>💡 Open your UPI app to approve the payment request.</p>
                  </div>
                </form>
              </div>

              <!-- Net Banking Form -->
              <div *ngIf="selectedMethod === 'NET_BANKING'" class="card-form-container fade-in">
                <form [formGroup]="netBankingForm" class="card-form">
                  <div class="form-group full-width">
                     <label>Select Your Bank</label>
                     <div class="input-with-icon">
                       <span class="icon">🏛️</span>
                       <select class="form-control bank-select" formControlName="bankName"
                               [class.is-invalid]="fNet['bankName'].invalid && fNet['bankName'].touched">
                         <option value="" disabled selected>-- Choose Bank --</option>
                         <option value="HDFC">HDFC Bank</option>
                         <option value="SBI">State Bank of India</option>
                         <option value="ICICI">ICICI Bank</option>
                         <option value="AXIS">Axis Bank</option>
                         <option value="KOTAK">Kotak Mahindra Bank</option>
                       </select>
                     </div>
                     <div class="invalid-feedback" *ngIf="fNet['bankName'].invalid && fNet['bankName'].touched">
                        Please select a bank
                     </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>Account Number</label>
                      <div class="input-with-icon">
                        <span class="icon">🔢</span>
                        <input type="text" formControlName="accountNumber" maxlength="18" placeholder="XXXXXXXXXX"
                               [class.is-invalid]="fNet['accountNumber'].invalid && fNet['accountNumber'].touched">
                      </div>
                      <div class="invalid-feedback" *ngIf="fNet['accountNumber'].invalid && fNet['accountNumber'].touched">
                        Enter valid account number
                      </div>
                    </div>
                    <div class="form-group">
                      <label>IFSC Code</label>
                      <div class="input-with-icon">
                        <span class="icon">🏦</span>
                        <input type="text" formControlName="ifsc" maxlength="11" placeholder="ABCD0123456" style="text-transform: uppercase"
                               [class.is-invalid]="fNet['ifsc'].invalid && fNet['ifsc'].touched">
                      </div>
                       <div class="invalid-feedback" *ngIf="fNet['ifsc'].invalid && fNet['ifsc'].touched">
                        Enter valid IFSC code
                      </div>
                    </div>
                  </div>

                  <div class="form-group full-width">
                    <label>Secure OTP</label>
                    <div class="otp-container">
                      <div class="input-with-icon" style="flex: 1;">
                        <span class="icon">🔑</span>
                        <input type="text" formControlName="otp" maxlength="6" placeholder="Enter 6-digit OTP"
                               [class.is-invalid]="fNet['otp'].invalid && fNet['otp'].touched">
                      </div>
                      <button type="button" class="btn-otp" (click)="generateOtp()">
                        {{ generatedOtp && generatedOtp !== 'Generating...' ? 'Resend OTP' : 'Get OTP' }}
                      </button>
                    </div>
                    <div class="invalid-feedback" *ngIf="fNet['otp'].invalid && fNet['otp'].touched">
                       Enter valid 6-digit OTP
                    </div>
                     <p *ngIf="generatedOtp && generatedOtp !== 'Generating...'" class="text-success small mt-1">
                       ✅ OTP sent to registered mobile
                     </p>
                  </div>
                </form>
              </div>

            </div>
          </div>

          <!-- Right Column: Order Summary -->
          <div class="checkout-sidebar">
            <div class="order-summary-card">
              <h2>Order Summary</h2>
              
              <div class="cart-items-preview">
                <div *ngFor="let item of cartItems" class="preview-item">
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
              
              <div class="summary-divider"></div>
              
              <div class="cost-breakdown">
                <div class="cost-row">
                  <span>Subtotal</span>
                  <span>₹{{ subtotal }}</span>
                </div>
                <div class="cost-row">
                  <span>Shipping</span>
                  <span class="text-success">FREE</span>
                </div>
                <div class="cost-row" *ngIf="discount > 0">
                  <span>Discount</span>
                  <span class="text-danger">-₹{{ discount }}</span>
                </div>
              </div>
              
              <div class="summary-divider"></div>
              
              <div class="total-row">
                <span>Total</span>
                <span class="total-amount">₹{{ getOrderTotal() }}</span>
              </div>
              
              <button class="btn btn-primary btn-block btn-lg mt-3" 
                      (click)="confirmOrder()" 
                      [disabled]="!isPaymentValid() || processing">
                <span *ngIf="!processing">
                  {{ selectedMethod === 'COD' ? 'Place Order' : 'Pay ₹' + getOrderTotal() }}
                </span>
                <span *ngIf="processing">Processing...</span>
              </button>
              
              <div class="secure-checkout-msg">
                🔒 Secure Checkout with SSL Encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-container {
      background-color: var(--bg-secondary);
      min-height: 100vh;
      padding: 2rem 0;
    }

    .checkout-header {
      margin-bottom: 2rem;
    }

    .checkout-header h1 {
      font-size: 1.75rem;
      margin: 0;
      color: var(--text-primary);
    }

    .checkout-layout {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 2rem;
    }

    /* Cards */
    .checkout-card {
      background: white;
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .card-header h2 {
      font-size: 1.25rem;
      margin: 0;
    }

    /* Payment Options */
    .payment-methods-grid {
      display: grid;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .payment-option {
      display: flex;
      align-items: center;
      padding: 1.25rem;
      border: 2px solid var(--border-color);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.2s;
    }

    .payment-option:hover {
      border-color: var(--primary-light);
      background-color: #f8fafc;
    }

    .payment-option.selected {
      border-color: var(--primary-color);
      background-color: #eff6ff;
    }

    .option-icon {
      font-size: 1.5rem;
      margin-right: 1rem;
      width: 40px;
      text-align: center;
    }

    .option-details {
      flex: 1;
    }

    .option-details h3 {
      font-size: 1rem;
      margin: 0 0 0.25rem 0;
      color: var(--text-primary);
    }

    .option-details p {
      margin: 0;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .radio-indicator {
      width: 20px;
      height: 20px;
      border: 2px solid #cbd5e1;
      border-radius: 50%;
      position: relative;
    }

    .payment-option.selected .radio-indicator {
      border-color: var(--primary-color);
    }

    .payment-option.selected .radio-indicator::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 10px;
      height: 10px;
      background-color: var(--primary-color);
      border-radius: 50%;
    }

    /* Card Form */
    .card-form-container {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      margin-top: 1rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-group label {
      display: block;
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .input-with-icon {
      position: relative;
    }

    .input-with-icon .icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.1rem;
      color: var(--text-secondary);
      pointer-events: none;
    }

    .card-form input, .bank-select {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.8rem;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
      background-color: white;
    }

    .card-form input:focus, .bank-select:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(26, 54, 93, 0.1);
    }
    
    .card-form input.is-invalid {
      border-color: var(--error-color);
      background-color: #fff5f5;
    }

    .invalid-feedback {
      color: var(--error-color);
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }

    .upi-info {
      background: #fffbeb;
      border: 1px solid #fcd34d;
      color: #92400e;
      padding: 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      margin-top: 1rem;
    }

    /* Order Summary Sidebar */
    .order-summary-card {
      background: white;
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 2rem;
    }

    .order-summary-card h2 {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    .cart-items-preview {
      margin-bottom: 1.5rem;
      max-height: 200px;
      overflow-y: auto;
    }

    .preview-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      font-size: 0.9rem;
    }

    .item-info-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .item-image img {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    .item-info {
      display: flex;
      flex-direction: column; /* Changed to column to stack name and qty */
      gap: 0.25rem;
    }

    .item-name {
      color: var(--text-primary);
      font-weight: 500;
      max-width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-qty {
      color: var(--text-secondary);
    }

    .item-price {
      font-weight: 600;
      color: var(--text-primary);
    }

    .summary-divider {
      height: 1px;
      background-color: var(--border-color);
      margin: 1rem 0;
    }

    .cost-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--text-primary);
    }

    .total-amount {
      color: var(--primary-color);
    }

    .secure-checkout-msg {
      text-align: center;
      font-size: 0.85rem;
      color: var(--text-light);
      margin-top: 1.5rem;
    }

    .fade-in {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 900px) {
      .checkout-layout {
        grid-template-columns: 1fr;
      }
      
      .order-summary-card {
        position: static;
      }
    }
    
    .otp-container {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }
    
    .btn-otp {
      background: var(--secondary-color);
      color: white;
      border: none;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      white-space: nowrap;
      height: 48px; /* Match input height */
      transition: background 0.2s;
    }
    
    .btn-otp:hover {
      background: #4a5568;
    }
  `]
})
export class PaymentComponent implements OnInit {
  selectedMethod: string = '';
  totalAmount: number = 0;
  addressId: number = 0;
  cartItems: any[] = [];
  subtotal: number = 0;
  discount: number = 0;
  processing = false;

  cardForm: FormGroup;
  netBankingForm: FormGroup;
  upiForm: FormGroup;
  generatedOtp: string = '';
  otpTimer: any;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private fb: FormBuilder
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.addressId = navigation.extras.state['addressId'];
      this.totalAmount = navigation.extras.state['total'] || 0;
      this.cartItems = navigation.extras.state['cartItems'] || [];
      this.subtotal = navigation.extras.state['subtotal'] || 0;
      this.discount = navigation.extras.state['discount'] || 0;
    }

    // Initialize Card Form
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiry: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/([0-9]{2})$'), this.expiryDateValidator]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
      name: ['', Validators.required]
    });

    // Initialize Net Banking Form
    this.netBankingForm = this.fb.group({
      bankName: ['', Validators.required],
      accountNumber: ['', [Validators.required, Validators.pattern('^[0-9]{9,18}$')]],
      ifsc: ['', [Validators.required, Validators.pattern('^[A-Z]{4}0[A-Z0-9]{6}$')]],
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });

    // Initialize UPI Form
    this.upiForm = this.fb.group({
      upiId: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9.\\-_]{2,256}@[a-zA-Z]{2,64}$')]]
    });
  }

  expiryDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const value = control.value;
    // Basic format check matches pattern
    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value)) {
      return null;
    }

    const [month, year] = value.split('/').map(Number);

    // Create date from current time
    const now = new Date();
    const currentYear = Number(now.getFullYear().toString().slice(-2)); // Last 2 digits
    const currentMonth = now.getMonth() + 1; // 1-12

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return { pastDate: true };
    }

    return null;
  }

  ngOnInit() {
    if (!this.totalAmount) {
      // In a real app, we might check if cart exists and recalculate, 
      // but for now redirecting to cart is safer to ensure state consistency.
      this.router.navigate(['/cart']);
    }
  }

  selectMethod(method: string) {
    this.selectedMethod = method;
  }

  selectedBank: string = '';

  get f() { return this.cardForm.controls; }
  get fNet() { return this.netBankingForm.controls; }
  get fUpi() { return this.upiForm.controls; }

  generateOtp() {
    this.generatedOtp = 'Generating...';
    setTimeout(() => {
      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
      this.generatedOtp = randomOtp;
      this.netBankingForm.patchValue({ otp: randomOtp });
      alert(`Your Simulated OTP is: ${randomOtp}`);
    }, 1000);
  }

  isPaymentValid(): boolean {
    if (!this.selectedMethod) return false;
    if (this.selectedMethod === 'CARD') {
      return this.cardForm.valid;
    }
    if (this.selectedMethod === 'NET_BANKING') {
      return this.netBankingForm.valid;
    }
    if (this.selectedMethod === 'UPI') {
      return this.upiForm.valid;
    }
    return true; // COD needs no validation
  }

  confirmOrder() {
    if (!this.isPaymentValid()) {
      if (this.selectedMethod === 'CARD') {
        this.cardForm.markAllAsTouched();
      } else if (this.selectedMethod === 'NET_BANKING') {
        this.netBankingForm.markAllAsTouched();
      } else if (this.selectedMethod === 'UPI') {
        this.upiForm.markAllAsTouched();
      }
      return;
    }

    this.placeOrder();
  }

  placeOrder() {
    this.processing = true;

    // Simulate network delay for realistic effect
    setTimeout(() => {
      let paymentDetails = null;
      if (this.selectedMethod === 'NET_BANKING') {
        paymentDetails = this.netBankingForm.value;
      } else if (this.selectedMethod === 'UPI') {
        paymentDetails = this.upiForm.value;
      } else if (this.selectedMethod === 'CARD') {
        // Don't send full card details to backend in simulation, just masking or token
        const val = this.cardForm.value;
        paymentDetails = {
          cardLast4: val.cardNumber.slice(-4),
          name: val.name
        };
      }

      const orderData = {
        addressId: this.addressId,
        paymentMethod: this.selectedMethod,
        paymentDetails: paymentDetails
      };

      this.orderService.placeOrder(orderData).subscribe({
        next: (response) => {
          this.processing = false;
          this.router.navigate(['/customer/order-confirmation'], {
            state: { orderId: response.orderId, total: this.totalAmount }
          });
        },
        error: (error) => {
          this.processing = false;
          alert('Error placing order: ' + error.message); // In real app, show toast
        }
      });
    }, 1500); // 1.5s delay
  }

  getOrderTotal(): number {
    return this.totalAmount || 0;
  }
}
