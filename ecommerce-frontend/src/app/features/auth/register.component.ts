import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="auth-container">
      <div class="auth-card fade-in">
        <div class="auth-header">
          <div class="icon-wrapper">
            <span class="user-icon">👤</span>
          </div>
          <h2>Create Account</h2>
          <p class="auth-subtitle">Join us to start your shopping journey</p>
        </div>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <!-- Name & Email Row -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Full Name <span class="required">*</span></label>
              <div class="input-wrapper">
                <input type="text" formControlName="name" 
                       class="form-input" 
                       [class.is-invalid]="isFieldInvalid('name')"
                       placeholder="Enter your full name">
              </div>
              <div class="invalid-feedback" *ngIf="isFieldInvalid('name')">
                Name is required (min 2 chars)
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Email <span class="required">*</span></label>
              <div class="input-wrapper">
                <input type="email" formControlName="email"
                       class="form-input" 
                       [class.is-invalid]="isFieldInvalid('email')"
                       placeholder="name@example.com">
              </div>
               <div class="invalid-feedback" *ngIf="isFieldInvalid('email')">
                Please enter a valid email address
              </div>
            </div>
          </div>

          <!-- Phone Number -->
          <div class="form-group">
            <label class="form-label">Phone Number <span class="required">*</span></label>
            <div class="phone-input-group">
              <select formControlName="countryCode" 
                      class="form-select country-code" style="width: 100px;">
                <option *ngFor="let code of countryCodes | keyvalue" [value]="code.value">
                  {{code.value}}
                </option>
              </select>
              <input type="tel" formControlName="phone"
                     class="form-input" 
                     [class.is-invalid]="isFieldInvalid('phone')"
                     placeholder="10-digit number">
            </div>
            <div class="invalid-feedback" *ngIf="isFieldInvalid('phone')" style="display: block;">
              <span *ngIf="f['phone'].errors?.['required']">Phone number is required</span>
              <span *ngIf="f['phone'].errors?.['pattern']">Must be 10 digits and not start with 0</span>
            </div>
          </div>

          <!-- Password Row -->
          <div class="form-row" formGroupName="passwordGroup">
            <div class="form-group">
              <label class="form-label">Password <span class="required">*</span></label>
              <div class="input-wrapper">
                <input type="password" formControlName="password"
                       class="form-input" 
                       [class.is-invalid]="isFieldInvalid('passwordGroup.password')"
                       (input)="checkPasswordStrength()"
                       placeholder="Min 6 chars">
              </div>
               <div class="invalid-feedback" *ngIf="isFieldInvalid('passwordGroup.password')">
                Password must be at least 6 characters
              </div>
              <div *ngIf="f['passwordGroup'].get('password')?.value" class="password-strength-meter">
                <div class="strength-bar" [style.width.%]="passwordStrength" 
                     [style.background-color]="passwordStrengthColor"></div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Confirm Password <span class="required">*</span></label>
              <div class="input-wrapper">
                <input type="password" formControlName="confirmPassword"
                       class="form-input" 
                       [class.is-invalid]="registerForm.get('passwordGroup')?.hasError('mismatch') && registerForm.get('passwordGroup.confirmPassword')?.touched"
                       placeholder="Re-enter password">
              </div>
              <div class="invalid-feedback" *ngIf="registerForm.get('passwordGroup')?.hasError('mismatch') && registerForm.get('passwordGroup.confirmPassword')?.touched" style="display: block;">
                Passwords do not match
              </div>
            </div>
          </div>

          <!-- Address Section Header -->
          <div class="section-divider">
            <span>Address Details</span>
          </div>

          <!-- Address Fields -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Country <span class="required">*</span></label>
              <select formControlName="country" 
                      class="form-select" (change)="onCountryChange()"
                      [class.is-invalid]="isFieldInvalid('country')">
                <option value="">Select Country</option>
                <option *ngFor="let country of countries" [value]="country">{{country}}</option>
              </select>
               <div class="invalid-feedback" *ngIf="isFieldInvalid('country')">
                Country is required
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">State <span class="required">*</span></label>
              <select formControlName="state" 
                      class="form-select"
                      [class.is-invalid]="isFieldInvalid('state')">
                <option value="">Select State</option>
                <option *ngFor="let state of states" [value]="state">{{state}}</option>
              </select>
               <div class="invalid-feedback" *ngIf="isFieldInvalid('state')">
                State is required
              </div>
            </div>
          </div>

          <div class="form-row">
             <div class="form-group">
              <label class="form-label">City <span class="required">*</span></label>
              <input type="text" formControlName="city"
                     class="form-input" 
                     [class.is-invalid]="isFieldInvalid('city')"
                     placeholder="City">
               <div class="invalid-feedback" *ngIf="isFieldInvalid('city')">
                City is required
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Zip Code <span class="required">*</span></label>
              <select formControlName="zipCode" 
                      class="form-select"
                      [class.is-invalid]="isFieldInvalid('zipCode')">
                <option value="">Select Zip</option>
                <option *ngFor="let zip of zipCodes" [value]="zip">{{zip}}</option>
              </select>
               <div class="invalid-feedback" *ngIf="isFieldInvalid('zipCode')">
                Zip Code is required
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Address <span class="required">*</span></label>
            <textarea formControlName="address1" 
                      class="form-input" rows="2"
                      [class.is-invalid]="isFieldInvalid('address1')"
                      placeholder="Street address, building, etc."></textarea>
             <div class="invalid-feedback" *ngIf="isFieldInvalid('address1')">
                Address is required
              </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg mt-3"
                  [disabled]="registerForm.invalid || loading">
            <span *ngIf="!loading">Create Account</span>
            <span *ngIf="loading">Creating...</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login" class="link-primary">Sign In</a></p>
        </div>

        <!-- Success Message -->
        <div *ngIf="success" class="success-message fade-in">
          <div class="success-icon">✅</div>
          <div class="message-content">
            <strong>{{success}}</strong>
            <p *ngIf="customerId">Customer ID: {{customerId}}</p>
          </div>
        </div>

        <!-- Error Message -->
        <div *ngIf="error" class="error-message fade-in">
          <span class="error-icon">⚠️</span>
          {{ error }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 2rem 1rem;
    }

    .auth-card {
      background: white;
      border-radius: 24px;
      padding: 2.5rem;
      width: 100%;
      max-width: 650px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.5);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .icon-wrapper {
      width: 60px;
      height: 60px;
      background: rgba(26, 54, 93, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
    }

    .user-icon {
      font-size: 1.75rem;
    }

    h2 {
      font-size: 1.75rem;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .auth-subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      margin-bottom: 1.25rem;
      position: relative; /* For absolute positioning of feedback if needed */
    }

    .form-label {
      display: block;
      margin-bottom: 0.4rem;
      color: var(--text-primary);
      font-weight: 500;
      font-size: 0.9rem;
    }

    .required {
      color: var(--error-color);
    }

    .form-input, .form-select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid var(--border-color);
      border-radius: 10px;
      font-size: 0.95rem;
      transition: all 0.2s;
      background: #f8fafc;
    }

    .form-input:focus, .form-select:focus {
      border-color: var(--primary-color);
      background: white;
      outline: none;
      box-shadow: 0 0 0 3px rgba(26, 54, 93, 0.1);
    }
    
    .form-input.is-invalid, .form-select.is-invalid {
      border-color: var(--error-color);
      background-color: #fff5f5;
    }

    .invalid-feedback {
      color: var(--error-color);
      font-size: 0.8rem;
      margin-top: 0.25rem;
      display: none; /* Hidden by default, shown by conditional */
    }
    
    /* Make visible when rendered */
    .invalid-feedback {
        display: block;
        animation: slideDown 0.2s ease-out;
    }
    
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .phone-input-group {
      display: flex;
      gap: 0.5rem;
    }

    .password-strength-meter {
      height: 4px;
      background: #e2e8f0;
      border-radius: 2px;
      margin-top: 0.5rem;
      overflow: hidden;
    }

    .strength-bar {
      height: 100%;
      transition: width 0.3s ease, background-color 0.3s ease;
    }

    .section-divider {
      display: flex;
      align-items: center;
      margin: 1.5rem 0;
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .section-divider::before,
    .section-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border-color);
    }

    .section-divider span {
      padding: 0 1rem;
    }

    .btn-block {
      width: 100%;
    }

    .mt-3 {
      margin-top: 1.5rem;
    }

    .auth-footer {
      margin-top: 1.5rem;
      text-align: center;
      font-size: 0.95rem;
    }

    .link-primary {
      color: var(--primary-color);
      font-weight: 600;
      text-decoration: none;
    }

    .error-message {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #fee2e2;
      border: 1px solid #fecaca;
      border-radius: 12px;
      color: #991b1b;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .success-message {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #d1fae5;
      border: 1px solid #a7f3d0;
      border-radius: 12px;
      color: #065f46;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }
    
    .success-icon {
      font-size: 1.25rem;
    }

    @media (max-width: 640px) {
      .form-row {
        grid-template-columns: 1fr;
        gap: 0;
      }
      
      .auth-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  error = '';
  success = '';
  customerId = '';

  countries: string[] = [];
  states: string[] = [];
  zipCodes: string[] = [];
  countryCodes: { [key: string]: string } = {};

  passwordStrength = 0;
  passwordStrengthColor = '#ccc';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadCountries();
    this.loadCountryCodes();
    this.loadZipCodes();
  }

  initForm() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      address1: ['', Validators.required],
      // address2 is optional
      zipCode: ['', Validators.required],
      countryCode: ['+91', Validators.required],
      phone: ['', [
        Validators.required,
        Validators.pattern('^[1-9][0-9]{9}$') // Starts with 1-9, exactly 10 digits
      ]],
      email: ['', [Validators.required, Validators.email]],
      passwordGroup: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      }, { validators: this.passwordMatchValidator })
    });
  }

  // Custom validator for password matching
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Getter for easy access to form fields in template
  get f() { return this.registerForm.controls; }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  loadCountries() {
    this.http.get<string[]>('http://localhost:8080/api/data/countries').subscribe({
      next: (data) => this.countries = data,
      error: (err) => console.error('Error loading countries:', err)
    });
  }

  loadCountryCodes() {
    this.http.get<{ [key: string]: string }>('http://localhost:8080/api/data/country-codes').subscribe({
      next: (data) => this.countryCodes = data,
      error: (err) => console.error('Error loading country codes:', err)
    });
  }

  loadZipCodes() {
    this.http.get<string[]>('http://localhost:8080/api/data/zipcodes').subscribe({
      next: (data) => this.zipCodes = data,
      error: (err) => console.error('Error loading zip codes:', err)
    });
  }

  onCountryChange() {
    const country = this.registerForm.get('country')?.value;
    if (country) {
      this.http.get<string[]>(`http://localhost:8080/api/data/states?country=${country}`).subscribe({
        next: (data) => {
          this.states = data;
          this.registerForm.patchValue({ state: '' }); // Reset state

          // Update country code
          const code = this.countryCodes[country] || '+1';
          this.registerForm.patchValue({ countryCode: code });
        },
        error: (err) => console.error('Error loading states:', err)
      });
    }
  }

  checkPasswordStrength() {
    const password = this.registerForm.get('passwordGroup.password')?.value || '';
    let strength = 0;

    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[@#$%^&+=!]/.test(password)) strength += 15;

    this.passwordStrength = strength;

    if (strength < 40) {
      this.passwordStrengthColor = '#ff4444';
    } else if (strength < 70) {
      this.passwordStrengthColor = '#ffaa00';
    } else {
      this.passwordStrengthColor = '#00C851';
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const formValue = this.registerForm.value;

    // Combine country code with phone (remove + symbol for backend validation)
    const phoneWithCode = formValue.countryCode.replace('+', '') + formValue.phone;

    const registrationData = {
      name: formValue.name,
      country: formValue.country,
      state: formValue.state,
      city: formValue.city,
      address1: formValue.address1,
      // address2 if implemented
      zipCode: formValue.zipCode,
      phone: phoneWithCode,
      email: formValue.email,
      password: formValue.passwordGroup.password,
      confirmPassword: formValue.passwordGroup.confirmPassword
    };

    this.authService.register(registrationData).subscribe({
      next: (response: any) => {
        // this.loading = false; // Keep loading
        this.success = response.message || 'Registration successful!';
        this.customerId = response.customerId || '';

        this.toast.show('Registration Successful! Redirecting to Login...', 'success');

        // Redirect after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        let diffError = 'Registration failed.';
        if (err.error && err.error.error) {
          diffError = err.error.error;
        }

        this.toast.show(diffError, 'error');
        this.error = diffError;
        console.error('Register error:', err);
      }
    });
  }
}
