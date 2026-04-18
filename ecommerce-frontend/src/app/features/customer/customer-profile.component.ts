import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-customer-profile',
  template: `
    <div class="profile-container">
      <div class="profile-card fade-in">
        <div class="profile-header">
          <div class="avatar-wrapper">
            <span class="avatar-text">{{ getInitials(profile?.name) }}</span>
            <button class="edit-avatar-btn" title="Change Avatar">📷</button>
          </div>
          <h2>{{ profile?.name || 'My Profile' }}</h2>
          <p class="profile-email">{{ profile?.email }}</p>
          <div class="customer-badge">
            <span>Customer ID: #{{ profile?.customerId }}</span>
          </div>
        </div>

        <!-- View Mode -->
        <div *ngIf="!editing && profile" class="profile-view fade-in">
          <div class="info-grid">
            <div class="info-group">
              <label>Phone Number</label>
              <p>{{ profile.phone }}</p>
            </div>
            <div class="info-group">
              <label>Location</label>
              <p>{{ profile.city }}, {{ profile.state }}, {{ profile.country }}</p>
            </div>
            <div class="info-group full-width">
              <label>Address</label>
              <p>{{ profile.address1 }}</p>
              <p *ngIf="profile.address2" class="address-line-2">{{ profile.address2 }}</p>
              <p class="zip-code">ZIP: {{ profile.zipCode }}</p>
            </div>
          </div>

          <div class="action-buttons">
            <button class="btn btn-primary" (click)="startEdit()">
              <span class="btn-icon">✏️</span> Edit Profile
            </button>
            <button class="btn btn-outline" routerLink="/customer/orders">
              <span class="btn-icon">📦</span> My Orders
            </button>
          </div>
        </div>

        <!-- Edit Mode -->
        <div *ngIf="editing && profile" class="profile-edit fade-in">
          <form (ngSubmit)="saveProfile()" #profileForm="ngForm" class="edit-form">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" [(ngModel)]="profile.name" name="name" 
                     class="form-input" required maxlength="50">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Phone</label>
                <input type="tel" [(ngModel)]="profile.phone" name="phone" 
                       class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Country</label>
                <input type="text" [(ngModel)]="profile.country" name="country" 
                       class="form-input" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">State</label>
                <input type="text" [(ngModel)]="profile.state" name="state" 
                       class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">City</label>
                <input type="text" [(ngModel)]="profile.city" name="city" 
                       class="form-input" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Address Line 1</label>
              <textarea [(ngModel)]="profile.address1" name="address1" 
                        class="form-input" required rows="2"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Address Line 2</label>
                <input type="text" [(ngModel)]="profile.address2" name="address2" 
                       class="form-input">
              </div>
              <div class="form-group">
                <label class="form-label">ZIP Code</label>
                <input type="text" [(ngModel)]="profile.zipCode" name="zipCode" 
                       class="form-input" required>
              </div>
            </div>

            <div class="edit-actions">
              <button type="button" class="btn btn-secondary" (click)="cancelEdit()">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" 
                      [disabled]="!profileForm.valid || saving">
                {{ saving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>

        <div *ngIf="success" class="alert success-alert fade-in">
          <span class="alert-icon">✅</span> Profile updated successfully!
        </div>

        <div *ngIf="error" class="alert error-alert fade-in">
          <span class="alert-icon">⚠️</span> {{ error }}
        </div>

        <div *ngIf="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
        .profile-container {
            min-height: 100vh;
            padding: 2rem 1rem;
            background-color: var(--bg-secondary);
            display: flex;
            justify-content: center;
            align-items: flex-start;
        }

        .profile-card {
            background: white;
            border-radius: 24px;
            padding: 2.5rem;
            width: 100%;
            max-width: 600px;
            box-shadow: var(--shadow-md);
            border: 1px solid var(--border-color);
        }

        .profile-header {
            text-align: center;
            margin-bottom: 2.5rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid var(--border-color);
        }

        .avatar-wrapper {
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            position: relative;
            color: white;
            font-size: 2.5rem;
            font-weight: 600;
            box-shadow: var(--shadow-sm);
        }

        .edit-avatar-btn {
            position: absolute;
            bottom: 0;
            right: 0;
            background: white;
            border: 1px solid var(--border-color);
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 1rem;
            box-shadow: var(--shadow-sm);
        }

        .profile-header h2 {
            margin: 0.5rem 0 0.25rem;
            color: var(--text-primary);
            font-size: 1.5rem;
        }

        .profile-email {
            color: var(--text-secondary);
            margin-bottom: 1rem;
        }

        .customer-badge {
            display: inline-block;
            background: #e0e7ff; /* Indigo 100 */
            color: var(--primary-color);
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }

        /* Info Grid */
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .full-width {
            grid-column: 1 / -1;
        }

        .info-group label {
            display: block;
            font-size: 0.85rem;
            color: var(--text-secondary);
            margin-bottom: 0.35rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
        }

        .info-group p {
            margin: 0;
            color: var(--text-primary);
            font-size: 1.05rem;
            font-weight: 500;
        }

        .address-line-2 {
            margin-top: 0.25rem !important;
        }

        .zip-code {
            margin-top: 0.25rem !important;
            color: var(--text-secondary) !important;
            font-size: 0.95rem !important;
        }

        /* Action Buttons */
        .action-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }

        .btn-icon {
            margin-right: 0.5rem;
        }

        /* Edit Form */
        .edit-form {
            text-align: left;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .form-group {
            margin-bottom: 1.25rem;
        }

        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
            font-weight: 500;
        }

        .form-input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.2s;
        }

        .form-input:focus {
            border-color: var(--primary-color);
            outline: none;
            box-shadow: 0 0 0 3px rgba(26, 54, 93, 0.1);
        }

        .edit-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border-color);
        }

        /* Alerts */
        .alert {
            margin-top: 1.5rem;
            padding: 1rem;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .success-alert {
            background: #dcfce7;
            color: #166534;
            border: 1px solid #bbf7d0;
        }

        .error-alert {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
        }

        .loading-state {
            text-align: center;
            padding: 2rem;
        }

        @media (max-width: 640px) {
            .info-grid, .form-row {
                grid-template-columns: 1fr;
            }
            
            .action-buttons {
                flex-direction: column;
            }
        }
    `]
})
export class CustomerProfileComponent implements OnInit {
  profile: any = null;
  originalProfile: any = null;
  editing = false;
  loading = false;
  saving = false;
  success = false;
  error = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadProfile();
    this.route.queryParams.subscribe((params: any) => {
      if (params['mode'] === 'edit') {
        this.editing = true;
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  loadProfile() {
    this.loading = true;

    // Subscribe to loading status first
    this.authService.loading$.subscribe((isLoading: boolean) => {
      if (!isLoading) {
        // Only proceed when auth check is done
        const user = this.authService.getCurrentUser();

        if (user && user.userId) {
          this.http.get<any>(`http://localhost:8080/api/users/profile`,
            { withCredentials: true })
            .subscribe({
              next: (data) => {
                this.profile = data;
                this.originalProfile = { ...data };
                this.loading = false;
              },
              error: (err) => {
                this.error = 'Failed to load profile';
                this.loading = false;
                console.error(err);
              }
            });
        } else {
          // Now we are sure user is not logged in
          this.router.navigate(['/login']);
        }
      }
    });
  }

  startEdit() {
    this.editing = true;
    this.success = false;
    this.error = '';
  }

  cancelEdit() {
    this.profile = { ...this.originalProfile };
    this.editing = false;
    this.success = false;
    this.error = '';
  }

  saveProfile() {
    this.saving = true;
    this.error = '';

    this.http.put<any>(`http://localhost:8080/api/users/profile`,
      this.profile, { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.profile = data;
          this.originalProfile = { ...data };
          this.editing = false;
          this.saving = false;
          this.success = true;
          setTimeout(() => this.success = false, 3000);
        },
        error: (err) => {
          this.error = err.error?.error || 'Failed to update profile';
          this.saving = false;
        }
      });
  }
}
