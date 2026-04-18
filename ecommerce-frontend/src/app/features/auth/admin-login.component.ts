import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-login',
  template: `
    <div class="admin-login-wrapper">
      <div class="login-card fade-in">
        <div class="icon-wrapper">
          <span class="lock-icon">🔐</span>
        </div>
        
        <h2>Admin Portal</h2>
        <p class="subtitle">Secure access for administrators only</p>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label class="form-label">Username</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input type="text" formControlName="username" 
                     class="form-input" 
                     [class.is-invalid]="f['username'].invalid && f['username'].touched"
                     placeholder="Enter admin username">
            </div>
             <div class="invalid-feedback" *ngIf="f['username'].invalid && f['username'].touched">
                Username is required
             </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-wrapper">
              <span class="input-icon">🔑</span>
              <input type="password" formControlName="password"
                     class="form-input" 
                     [class.is-invalid]="f['password'].invalid && f['password'].touched"
                     placeholder="Enter admin password">
            </div>
             <div class="invalid-feedback" *ngIf="f['password'].invalid && f['password'].touched">
                Password is required
             </div>
          </div>

          <button type="submit" class="btn-login" [disabled]="loginForm.invalid || loading">
            <span *ngIf="!loading">Access Dashboard</span>
            <span *ngIf="loading" class="spinner"></span>
          </button>
        </form>

        <div *ngIf="error" class="message error-message slide-up">
          <span class="msg-icon">❌</span> {{ error }}
        </div>

        <div *ngIf="success" class="message success-message slide-up">
          <span class="msg-icon">✅</span> {{ success }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--bg-secondary);
      padding: 1rem;
      position: relative;
      overflow: hidden;
    }

    /* Abstract Background Shapes - Soft Pastel for Light Theme */
    .admin-login-wrapper::before, .admin-login-wrapper::after {
      content: '';
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      z-index: 0;
      opacity: 0.6;
    }
    
    .admin-login-wrapper::before {
      width: 300px;
      height: 300px;
      background: #e0f2fe; /* Light Sky Blue */
      top: -50px;
      left: -50px;
    }
    
    .admin-login-wrapper::after {
      width: 400px;
      height: 400px;
      background: #ede9fe; /* Light Violet */
      bottom: -100px;
      right: -100px;
    }

    .login-card {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      border-radius: 24px;
      padding: 3rem 2.5rem;
      width: 100%;
      max-width: 420px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
      position: relative;
      z-index: 1;
    }

    .icon-wrapper {
      width: 80px;
      height: 80px;
      background: rgba(26, 54, 93, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      box-shadow: 0 0 20px rgba(56, 189, 248, 0.1);
    }

    .lock-icon {
      font-size: 2.5rem;
    }

    h2 {
      color: var(--text-primary);
      font-size: 2rem;
      margin: 0 0 0.5rem 0;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .subtitle {
      color: var(--text-secondary);
      margin-bottom: 2.5rem;
      font-size: 0.95rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
      text-align: left;
    }

    .form-label {
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      display: block;
    }

    .input-wrapper {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.2rem;
      opacity: 0.5;
      color: var(--text-secondary);
    }

    .form-input {
      width: 100%;
      padding: 0.85rem 1rem 0.85rem 3rem;
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      color: var(--text-primary);
      font-size: 1rem;
      transition: all 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 4px rgba(26, 54, 93, 0.1);
      background: #ffffff;
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
    
    .form-input::placeholder {
      color: var(--text-light);
    }

    .btn-login {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      border: none;
      border-radius: 12px;
      color: white;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
    }
    
    .btn-login:disabled {
      opacity: 0.7;
      cursor: wait;
    }

    /* Messages */
    .message {
      margin-top: 1.5rem;
      padding: 1rem;
      border-radius: 12px;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-align: left;
    }

    .error-message {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #fca5a5;
    }

    .success-message {
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.2);
      color: #86efac;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Animations */
    .fade-in {
      animation: fadeIn 0.6s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .slide-up {
      animation: slideUp 0.3s ease-out;
    }
    
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AdminLoginComponent implements OnInit {
  loginForm!: FormGroup;
  error = '';
  success = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.error = '';
    this.success = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const credentials = this.loginForm.value;

    this.authService.adminLogin(credentials.username, credentials.password).subscribe({
      next: (response) => {
        // this.loading = false; // Keep loading true during delay
        this.toast.show('Admin Access Granted. Welcome.', 'success');
        this.success = 'Authentication verified. Redirecting...'; // Optional fallback text

        setTimeout(() => {
          this.router.navigate(['/admin/dashboard']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.toast.show('Access Denied: Invalid credentials.', 'error');
        this.error = 'Access Denied: Invalid credentials provided.';
        console.error('Admin login error:', err);
      }
    });
  }
}
