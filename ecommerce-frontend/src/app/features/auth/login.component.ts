import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="auth-container">
      <div class="auth-card fade-in">
        <div class="auth-header">
          <div class="icon-wrapper">
            <span class="lock-icon">🔒</span>
          </div>
          <h2>Welcome Back</h2>
          <p class="auth-subtitle">Sign in to access your account</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <div class="input-wrapper">
              <span class="input-icon">✉️</span>
              <input type="email" formControlName="email" 
                     class="form-input" 
                     [class.is-invalid]="f['email'].invalid && f['email'].touched"
                     placeholder="name@example.com">
            </div>
             <div class="invalid-feedback" *ngIf="f['email'].invalid && f['email'].touched">
                Please enter a valid email address
             </div>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-wrapper">
              <span class="input-icon">🔑</span>
              <input type="password" formControlName="password"
                     class="form-input" 
                     [class.is-invalid]="f['password'].invalid && f['password'].touched"
                     placeholder="Enter your password">
            </div>
             <div class="invalid-feedback" *ngIf="f['password'].invalid && f['password'].touched">
                Password is required
             </div>
          </div>

          <div class="flex-between mb-4">
            <label class="checkbox-label">
              <input type="checkbox"> 
              <span>Remember me</span>
            </label>
            <a href="#" class="forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg"
                  [disabled]="loginForm.invalid || loading">
            <span *ngIf="!loading">Sign In</span>
            <span *ngIf="loading">Signing In...</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register" class="link-primary">Create Account</a></p>
          
          <div class="divider">
            <span>OR</span>
          </div>

          <button routerLink="/admin/login" class="btn btn-outline btn-block">
            <span class="admin-icon">🛡️</span> Admin Login
          </button>
        </div>

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
      padding: 2rem;
    }

    .auth-card {
      background: white;
      border-radius: 24px;
      padding: 3rem;
      width: 100%;
      max-width: 450px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.5);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .icon-wrapper {
      width: 60px;
      height: 60px;
      background: rgba(26, 54, 93, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }

    .lock-icon {
      font-size: 1.75rem;
    }

    h2 {
      font-size: 1.75rem;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    .auth-subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
      font-weight: 500;
      font-size: 0.9rem;
    }

    .input-wrapper {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-secondary);
      font-size: 1.1rem;
      pointer-events: none;
    }

    .form-input {
      width: 100%;
      padding: 0.875rem 1rem 0.875rem 3rem;
      border: 2px solid var(--border-color);
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.2s;
      background: #f8fafc;
    }

    .form-input:focus {
      border-color: var(--primary-color);
      background: white;
      outline: none;
      box-shadow: 0 0 0 4px rgba(26, 54, 93, 0.1);
    }
    
    .form-input.is-invalid {
      border-color: var(--error-color);
      background-color: #fff5f5;
    }
    
     .invalid-feedback {
      color: var(--error-color);
      font-size: 0.8rem;
      margin-top: 0.25rem;
      animation: slideDown 0.2s ease-out;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
      cursor: pointer;
    }

    .forgot-password {
      font-size: 0.9rem;
      color: var(--primary-color);
      font-weight: 500;
      text-decoration: none;
    }

    .btn-block {
      width: 100%;
      justify-content: center;
    }

    .btn-lg {
      padding: 0.875rem;
      font-size: 1.1rem;
    }

    .auth-footer {
      margin-top: 2rem;
      text-align: center;
    }

    .auth-footer p {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .link-primary {
      color: var(--primary-color);
      font-weight: 600;
      text-decoration: none;
    }

    .divider {
      margin: 1.5rem 0;
      display: flex;
      align-items: center;
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.85rem;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--border-color);
    }

    .divider span {
      padding: 0 1rem;
    }

    .btn-outline {
      background: white;
      border: 2px solid var(--border-color);
      color: var(--text-primary);
    }

    .btn-outline:hover {
      border-color: var(--text-primary);
      background: #f8fafc;
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

    .error-icon {
      font-size: 1.25rem;
    }
    
     @keyframes slideDown {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  error = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.toast.show('Login Successful! Welcome back.', 'success');

        // Delay redirect to show toast
        setTimeout(() => {
          this.loading = false;
          this.router.navigate(['/customer/home']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.toast.show('Invalid email or password', 'error');
        this.error = 'Invalid email or password';
        console.error('Login error:', err);
      }
    });
  }
}
