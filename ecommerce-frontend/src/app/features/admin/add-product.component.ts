import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  template: `
    <div class="add-product-container fade-in">
      <div class="header-section">
        <h1>➕ Add New Product</h1>
        <button class="btn btn-secondary btn-back" routerLink="/admin/products">
          ← Back to Products
        </button>
      </div>

      <div class="content-grid">
        <!-- Main Form -->
        <div class="card form-card">
          <form (ngSubmit)="addProduct()" #productForm="ngForm">
            <div class="form-section">
              <h3>Product Details</h3>
              
              <div class="form-group">
                <label class="form-label">Product Name <span class="required">*</span></label>
                <input type="text" [(ngModel)]="product.productName" name="productName" 
                       class="form-input" required placeholder="Enter unique product name"
                       #nameModel="ngModel">
                <div *ngIf="nameModel.invalid && (nameModel.dirty || nameModel.touched)" class="validation-error">
                  Product name is required
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-half">
                  <label class="form-label">Price (₹) <span class="required">*</span></label>
                  <div class="input-with-icon">
                    <span class="prefix">₹</span>
                    <input type="number" [(ngModel)]="product.price" name="price" 
                           class="form-input" required min="0" step="0.01" 
                           placeholder="0.00">
                  </div>
                </div>

                <div class="form-group col-half">
                   <label class="form-label">Category <span class="required">*</span></label>
                   <select [(ngModel)]="product.category" name="category" 
                           class="form-select" required>
                     <option value="" disabled selected>Select Category</option>
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
                          class="form-textarea" required rows="4" maxlength="500"
                          placeholder="Enter detailed product description"></textarea>
                <div class="char-count">
                    {{product.description.length}}/500 characters
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>Inventory & Status</h3>
              <div class="form-row">
                <div class="form-group col-half">
                  <label class="form-label">Stock Quantity <span class="required">*</span></label>
                  <input type="number" [(ngModel)]="product.quantityAvailable" name="quantity" 
                         class="form-input" required min="0" 
                         placeholder="0">
                </div>

                <div class="form-group col-half">
                  <label class="form-label">Status</label>
                  <select [(ngModel)]="product.status" name="status" class="form-select">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="form-section">
                <h3>Product Image</h3>
                <div class="form-group">
                    <label class="form-label">Image URL <span class="required">*</span></label>
                    <input type="url" [(ngModel)]="product.imageUrl" name="imageUrl" 
                           class="form-input" required placeholder="https://example.com/image.jpg">
                </div>
                
                <div class="image-preview" *ngIf="product.imageUrl">
                    <p>Preview:</p>
                    <img [src]="product.imageUrl" alt="Preview" (error)="imageError=true" 
                         [class.hidden]="imageError">
                    <div *ngIf="imageError" class="image-placeholder error">
                        Invalid Image URL
                    </div>
                </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary btn-lg" (click)="resetForm()">
                Clear Form
              </button>
              <button type="submit" class="btn btn-primary btn-lg" 
                      [disabled]="!productForm.valid || submitting">
                {{submitting ? 'Adding...' : '✅ Save Product'}}
              </button>
            </div>
          </form>
        </div>

        <!-- Sidebar / Bulk Upload -->
        <div class="sidebar">
            <!-- Success/Error Messages -->
            <div *ngIf="success" class="alert alert-success fade-in">
                <div class="alert-icon">✅</div>
                <div class="alert-content">
                    <h4>Success!</h4>
                    <p>Product "<strong>{{addedProduct?.productName}}</strong>" added.</p>
                </div>
            </div>

            <div *ngIf="error" class="alert alert-error fade-in">
                <div class="alert-icon">❌</div>
                <div class="alert-content">
                    <h4>Error</h4>
                    <p>{{error}}</p>
                </div>
            </div>

            <div class="card bulk-card">
              <h3>📤 Bulk Import</h3>
              <p class="text-secondary">Upload multiple products via CSV/Excel.</p>
              
              <div class="upload-area" [class.has-file]="selectedFile">
                <input type="file" (change)="onFileSelect($event)" 
                       accept=".csv,.xls,.xlsx" id="fileUpload" class="file-input">
                <label for="fileUpload" class="file-label">
                    <span class="upload-icon">📁</span>
                    <span class="upload-text">{{ selectedFile ? selectedFile.name : 'Choose file...' }}</span>
                </label>
              </div>

              <button class="btn btn-primary btn-block mt-3" 
                      (click)="uploadBulk()" [disabled]="!selectedFile">
                Upload & Import
              </button>
              
              <div class="download-template mt-3">
                  <a href="#" (click)="downloadTemplate($event)">Download CSV Template</a>
              </div>
            </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .add-product-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
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

    .content-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
    }

    .card {
        background: white;
        border-radius: 16px;
        box-shadow: var(--shadow-sm);
        border: 1px solid var(--border-color);
        padding: 2rem;
    }

    .form-section {
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid var(--border-color);
    }
    .form-section:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }

    .form-section h3 {
        font-size: 1.1rem;
        color: var(--text-primary);
        margin-bottom: 1.5rem;
        font-weight: 600;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-row {
        display: flex;
        gap: 1.5rem;
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
        transition: all 0.2s;
        background: #f8fafc;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
        outline: none;
        border-color: var(--primary-color);
        background: white;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .input-with-icon {
        position: relative;
    }
    .input-with-icon .prefix {
        position: absolute;
        left: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-secondary);
        font-weight: 500;
    }
    .input-with-icon input {
        padding-left: 2rem;
    }

    .char-count {
        text-align: right;
        font-size: 0.75rem;
        color: var(--text-secondary);
        margin-top: 0.25rem;
    }

    .validation-error {
        color: #ef4444;
        font-size: 0.85rem;
        margin-top: 0.25rem;
    }

    .image-preview {
        background: #f8fafc;
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
        margin-top: 1rem;
    }
    .image-preview img {
        max-width: 100%;
        max-height: 200px;
        border-radius: 8px;
        box-shadow: var(--shadow-sm);
    }
    .image-placeholder.error {
        color: #ef4444;
        padding: 1rem;
    }
    .hidden { display: none; }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid var(--border-color);
    }

    .btn-lg {
        padding: 0.75rem 2rem;
        font-size: 1rem;
    }

    /* Sidebar Styles */
    .sidebar {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .alert {
        padding: 1rem;
        border-radius: 12px;
        display: flex;
        gap: 1rem;
        border: 1px solid transparent;
        margin-bottom: 0;
    }

    .alert-success {
        background: #ecfdf5;
        border-color: #d1fae5;
        color: #065f46;
    }

    .alert-error {
        background: #fef2f2;
        border-color: #fee2e2;
        color: #991b1b;
    }

    .alert-icon { font-size: 1.5rem; }
    .alert-content h4 { margin: 0 0 0.25rem 0; font-size: 1rem; }
    .alert-content p { margin: 0; font-size: 0.9rem; }

    .bulk-card {
        text-align: center;
    }
    
    .upload-area {
        margin: 1.5rem 0;
    }

    .file-input { display: none; }

    .file-label {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        border: 2px dashed var(--border-color);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
        background: #f8fafc;
    }

    .file-label:hover {
        border-color: var(--primary-color);
        background: #eff6ff;
    }

    .upload-icon { font-size: 2rem; margin-bottom: 0.5rem; }
    .upload-text { font-size: 0.9rem; color: var(--text-secondary); font-weight: 500; }

    .has-file .file-label {
        border-color: #10b981;
        background: #ecfdf5;
    }

    .btn-block { width: 100%; }

    .download-template {
        font-size: 0.85rem;
    }
    .download-template a {
        color: var(--primary-color);
        text-decoration: none;
    }
    .download-template a:hover { text-decoration: underline; }

    @media (max-width: 900px) {
        .content-grid { grid-template-columns: 1fr; }
        .sidebar { order: -1; }
    }
  `]
})
export class AddProductComponent {
  product = {
    productName: '',
    imageUrl: '',
    price: 0,
    category: '',
    description: '',
    quantityAvailable: 0,
    status: 'Active'
  };

  submitting = false;
  success = false;
  error = '';
  addedProduct: any = null;
  selectedFile: File | null = null;
  imageError = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  addProduct() {
    this.submitting = true;
    this.success = false;
    this.error = '';

    this.http.post<any>('http://localhost:8080/api/admin/products', this.product,
      { withCredentials: true })
      .subscribe({
        next: (response) => {
          this.submitting = false;
          this.success = true;
          this.addedProduct = response;
          this.scrollToTop();
          // Optional: reset form after delay or leave it for user to add another
        },
        error: (err) => {
          this.submitting = false;
          this.error = err.error?.error || 'Failed to add product. Please try again.';
          console.error('Error:', err);
          this.scrollToTop();
        }
      });
  }

  resetForm() {
    this.product = {
      productName: '',
      imageUrl: '',
      price: 0,
      category: '',
      description: '',
      quantityAvailable: 0,
      status: 'Active'
    };
    this.success = false;
    this.error = '';
    this.addedProduct = null;
    this.imageError = false;
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  uploadBulk() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://localhost:8080/api/admin/products/bulk-upload', formData,
      { withCredentials: true })
      .subscribe({
        next: () => {
          alert('Bulk upload successful!');
          this.selectedFile = null;
        },
        error: (err) => {
          alert('Bulk upload failed: ' + (err.error?.error || 'Unknown error'));
        }
      });
  }

  downloadTemplate(event: Event) {
    event.preventDefault();
    const link = document.createElement('a');
    link.href = 'http://localhost:8080/api/admin/products/template';
    link.download = 'product_template.csv';
    link.click();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
