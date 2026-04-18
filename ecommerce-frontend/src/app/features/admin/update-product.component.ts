import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-product',
  template: `
    <div class="update-product-container fade-in">
      <div class="header-section">
        <h1>✏️ Update Product</h1>
         <button class="btn btn-secondary btn-back" routerLink="/admin/products">
          ← Back to Products
        </button>
      </div>

      <div class="content-wrapper">
        <!-- Search Section -->
        <div class="search-card" *ngIf="!productLoaded">
          <div class="search-content">
            <div class="search-icon">🔍</div>
            <h3>Find Product to Update</h3>
            <p>Enter the Product ID or Name to load details.</p>
            
            <div class="search-box">
              <input type="text" [(ngModel)]="searchQuery" 
                     placeholder="e.g. 101 or 'Running Shoes'"
                     class="search-input" (keyup.enter)="searchProduct()">
              <button class="btn btn-primary" (click)="searchProduct()" 
                      [disabled]="searching || !searchQuery.trim()">
                {{searching ? 'Searching...' : 'Search Product'}}
              </button>
            </div>

            <div *ngIf="searchError" class="alert alert-error mt-3 fade-in">
              ❌ {{searchError}}
            </div>
          </div>
        </div>

        <!-- Update Form -->
        <div class="card form-card fade-in" *ngIf="productLoaded">
          <div class="card-header">
            <div class="product-id-badge">ID: {{product.productId}}</div>
            <h2>Edit Product Details</h2>
          </div>

          <form (ngSubmit)="updateProduct()" #productForm="ngForm">
            <div class="form-grid">
              <!-- Left Column -->
              <div class="form-column">
                <div class="form-group">
                  <label class="form-label">Product Name <span class="required">*</span></label>
                  <input type="text" [(ngModel)]="product.productName" name="productName" 
                         class="form-input" required>
                </div>

                <div class="form-row">
                  <div class="form-group col-half">
                    <label class="form-label">Price (₹) <span class="required">*</span></label>
                    <div class="input-with-icon">
                      <span class="prefix">₹</span>
                      <input type="number" [(ngModel)]="product.price" name="price" 
                             class="form-input" required min="0" step="0.01">
                    </div>
                  </div>

                  <div class="form-group col-half">
                    <label class="form-label">Category <span class="required">*</span></label>
                    <select [(ngModel)]="product.category" name="category" 
                            class="form-select" required>
                      <option value="Fashion">Fashion</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Stationary">Stationary</option>
                      <option value="Home Decor">Home Decor</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Description <span class="required">*</span></label>
                    <textarea [(ngModel)]="product.description" name="description" 
                              class="form-textarea" required rows="5" maxlength="500"></textarea>
                    <div class="char-count">
                        {{product.description?.length || 0}}/500
                    </div>
                </div>
              </div>

              <!-- Right Column -->
              <div class="form-column">
                <div class="form-section">
                    <h3>Inventory & Status</h3>
                    <div class="form-group">
                        <label class="form-label">Stock Quantity <span class="required">*</span></label>
                        <input type="number" [(ngModel)]="product.quantityAvailable" name="quantity" 
                               class="form-input" required min="0">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <select [(ngModel)]="product.status" name="status" class="form-select">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Product Image</h3>
                    <div class="form-group">
                        <label class="form-label">Image URL <span class="required">*</span></label>
                        <input type="url" [(ngModel)]="product.imageUrl" name="imageUrl" 
                               class="form-input" required>
                    </div>
                    <div class="image-preview">
                        <img [src]="product.imageUrl" alt="Preview" 
                             (error)="imageError=true" [class.hidden]="imageError">
                        <div *ngIf="imageError" class="error-placeholder">Invalid Image</div>
                    </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="cancelUpdate()">
                ❌ Cancel
              </button>
              <button type="submit" class="btn btn-primary" 
                      [disabled]="!productForm.valid || submitting">
                {{submitting ? 'Updating...' : '✅ Save Changes'}}
              </button>
            </div>
            
            <div *ngIf="updateError" class="alert alert-error mt-3">
                {{updateError}}
            </div>
          </form>
        </div>

        <!-- Success overlay/modal could be here, but using simple alert logic for now, enhanced by simple container -->
        <div *ngIf="success" class="success-container fade-in">
           <div class="success-card">
              <div class="success-icon">🎉</div>
              <h2>Update Successful!</h2>
              <p>Product "<strong>{{product.productName}}</strong>" has been updated.</p>
              <div class="success-actions">
                  <button class="btn btn-primary" (click)="resetForm()">Update Another</button>
                  <button class="btn btn-secondary" routerLink="/admin/products">Go to Product List</button>
              </div>
           </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .update-product-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
        min-height: 80vh;
    }

    .header-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .header-section h1 {
        font-size: 2rem;
        color: var(--text-primary);
        margin: 0;
    }

    /* Search Section */
    .search-card {
        background: white;
        border-radius: 16px;
        padding: 4rem 2rem;
        text-align: center;
        box-shadow: var(--shadow-md);
        border: 1px solid var(--border-color);
    }

    .search-content h3 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }

    .search-content p {
        color: var(--text-secondary);
        margin-bottom: 2rem;
    }

    .search-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.8;
    }

    .search-box {
        display: flex;
        gap: 1rem;
        max-width: 500px;
        margin: 0 auto;
    }

    .search-input {
        flex: 1;
        padding: 0.75rem 1rem;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.2s;
    }

    .search-input:focus {
        outline: none;
        border-color: var(--primary-color);
    }

    /* Update Form */
    .card {
        background: white;
        border-radius: 16px;
        box-shadow: var(--shadow-sm);
        border: 1px solid var(--border-color);
        padding: 2rem;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-color);
    }

    .product-id-badge {
        background: #f1f5f9;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-family: monospace;
        font-weight: 600;
        color: var(--text-secondary);
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
    }

    .form-group { margin-bottom: 1.5rem; }
    
    .form-row {
        display: flex;
        gap: 1rem;
    }
    .col-half { flex: 1; }

    .form-label {
        display: block;
        font-weight: 500;
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .required { color: #ef4444; }

    .form-input, .form-select, .form-textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        font-size: 0.95rem;
        background: #f8fafc;
        transition: all 0.2s;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
        outline: none;
        border-color: var(--primary-color);
        background: white;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .input-with-icon { position: relative; }
    .input-with-icon .prefix {
        position: absolute;
        left: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-secondary);
        font-weight: 500;
    }
    .input-with-icon input { padding-left: 2rem; }

    .char-count {
        text-align: right;
        font-size: 0.75rem;
        color: var(--text-secondary);
        margin-top: 0.25rem;
    }

    .form-section {
        background: #f8fafc;
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 1.5rem;
    }

    .form-section h3 {
        font-size: 1rem;
        margin: 0 0 1rem 0;
        color: var(--text-primary);
        font-weight: 600;
    }

    .image-preview {
        text-align: center;
        background: white;
        padding: 1rem;
        border-radius: 8px;
        border: 1px dashed var(--border-color);
        margin-top: 1rem;
    }
    .image-preview img {
        max-width: 100%;
        max-height: 150px;
        border-radius: 8px;
    }
    .hidden { display: none; }
    .error-placeholder { color: #ef4444; font-size: 0.85rem; }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid var(--border-color);
    }

    .alert {
        padding: 1rem;
        border-radius: 8px;
        font-size: 0.9rem;
    }
    .alert-error { background: #fef2f2; color: #991b1b; border: 1px solid #fee2e2; }

    /* Success State */
    .success-container {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .success-card {
        background: white;
        padding: 3rem;
        border-radius: 16px;
        text-align: center;
        max-width: 400px;
        width: 90%;
        box-shadow: var(--shadow-lg);
        animation: slideUp 0.3s ease-out;
    }

    .success-icon { font-size: 4rem; margin-bottom: 1rem; }
    .success-actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 2rem;
    }

    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }

    @media (max-width: 768px) {
        .form-grid { grid-template-columns: 1fr; }
        .search-box { flex-direction: column; }
    }
  `]
})
export class UpdateProductComponent implements OnInit {
  searchQuery = '';
  searching = false;
  searchError = '';

  productLoaded = false;
  product: any = {};
  imageError = false;

  submitting = false;
  success = false;
  updateError = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.searchQuery = params['id'];
        this.searchProduct();
      }
    });
  }

  searchProduct() {
    if (!this.searchQuery.trim()) {
      this.searchError = 'Please enter a Product ID or Name';
      return;
    }

    this.searching = true;
    this.searchError = '';

    this.http.get<any>(`http://localhost:8080/api/admin/products/search?query=${this.searchQuery}`,
      { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.product = data;
          this.productLoaded = true;
          this.searching = false;
          this.imageError = false;
        },
        error: (err) => {
          this.searchError = err.error?.error || 'Product not found';
          this.searching = false;
        }
      });
  }

  updateProduct() {
    if (!confirm('Are you sure you want to update this product?')) return;

    this.submitting = true;
    this.updateError = '';

    this.http.put<any>(`http://localhost:8080/api/admin/products/${this.product.productId}`,
      this.product, { withCredentials: true })
      .subscribe({
        next: (response) => {
          this.submitting = false;
          this.success = true;
        },
        error: (err) => {
          this.submitting = false;
          this.updateError = err.error?.error || 'Failed to update product';
        }
      });
  }

  cancelUpdate() {
    if (confirm('Discard changes and go back to search?')) {
      this.resetForm();
    }
  }

  resetForm() {
    this.searchQuery = '';
    this.productLoaded = false;
    this.product = {};
    this.success = false;
    this.updateError = '';
    this.searchError = '';
    this.imageError = false;
  }
}
