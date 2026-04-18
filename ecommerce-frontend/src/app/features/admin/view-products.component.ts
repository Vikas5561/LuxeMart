import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-view-products',
    template: `
    <div class="view-products-container fade-in">
      <div class="header-section">
        <div>
            <h1>📦 Product Management</h1>
            <p class="subtitle">Manage your inventory, prices, and product details.</p>
        </div>
        <div class="header-actions">
          <button class="btn-refresh" (click)="loadProducts()" title="Refresh Data">
            🔄
          </button>
          <div class="export-group" *ngIf="products.length > 0">
              <select [(ngModel)]="downloadFormat" class="format-select">
                <option value="xlsx">Excel (.xlsx)</option>
                <option value="pdf">PDF</option>
              </select>
              <button class="btn btn-primary btn-icon-text" (click)="downloadProducts()">
                <span>📥</span> Export
              </button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-card">
        <div class="filters-header">
            <h3>🔍 Filters</h3>
            <button class="btn-link" (click)="clearFilters()">Clear All</button>
        </div>
        <div class="filters-grid">
            <div class="filter-group">
                <label>Product ID</label>
                <input type="text" [(ngModel)]="filters.id" (input)="applyFilters()" 
                       placeholder="e.g. 101" class="form-input">
            </div>
            <div class="filter-group">
                <label>Name</label>
                <input type="text" [(ngModel)]="filters.name" (input)="applyFilters()" 
                       placeholder="Search by name..." class="form-input">
            </div>
            <div class="filter-group">
                <label>Category</label>
                <select [(ngModel)]="filters.category" (change)="applyFilters()" class="form-select">
                  <option value="">All Categories</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Stationary">Stationary</option>
                  <option value="Home Decor">Home Decor</option>
                </select>
            </div>
             <div class="filter-group">
                <label>Price</label>
                <input type="number" [(ngModel)]="filters.price" (input)="applyFilters()" 
                       placeholder="Exact price" class="form-input">
            </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="table-card" *ngIf="!loading">
        <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let product of paginatedProducts" 
                    [class.row-inactive]="product.status === 'Inactive' || product.isDeleted">
                  <td class="text-secondary">#{{product.productId}}</td>
                  <td>
                    <div class="product-cell">
                        <img [src]="product.imageUrl" class="product-thumb" alt="Product">
                        <div class="product-info">
                            <span class="product-name">{{product.productName}}</span>
                            <span class="product-desc" title="{{product.description}}">
                                {{product.description | slice:0:40}}{{product.description?.length > 40 ? '...' : ''}}
                            </span>
                        </div>
                    </div>
                  </td>
                  <td><span class="category-tag">{{product.category}}</span></td>
                  <td><span class="price-tag">₹{{product.price | number:'1.2-2'}}</span></td>
                  <td>
                    <span class="stock-badge" [class.low-stock]="product.quantityAvailable < 10" 
                          [class.out-of-stock]="product.quantityAvailable === 0">
                        {{product.quantityAvailable}} units
                    </span>
                  </td>
                  <td>
                    <span class="status-badge" 
                          [ngClass]="{
                            'active': product.status === 'Active' && !product.isDeleted,
                            'inactive': product.status === 'Inactive' && !product.isDeleted,
                            'deleted': product.isDeleted
                          }">
                      {{product.isDeleted ? 'Deleted' : product.status}}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn-icon edit" (click)="editProduct(product)" title="Edit">
                        ✏️
                      </button>
                      <button class="btn-icon delete" *ngIf="!product.isDeleted" 
                              (click)="deleteProduct(product)" title="Delete">
                        🗑️
                      </button>
                      <button class="btn-icon restore" *ngIf="product.isDeleted" 
                              (click)="restoreProduct(product)" title="Restore">
                        ♻️
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
        </div>

        <div *ngIf="filteredProducts.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <p>No products found matching your filters</p>
          <button class="btn btn-secondary mt-2" (click)="clearFilters()">Clear Filters</button>
        </div>

        <!-- Pagination -->
        <div class="pagination-wrapper" *ngIf="filteredProducts.length > 0">
            <div class="pagination-info">
                Showing {{ (currentPage - 1) * pageSize + 1 }} - 
                {{ Math.min(currentPage * pageSize, filteredProducts.length) }} 
                of {{ filteredProducts.length }} products
            </div>
            <div class="pagination-controls">
                <button class="btn-page" [disabled]="currentPage === 1" 
                        (click)="changePage(currentPage - 1)">Previous</button>
                <div class="page-numbers">
                    <span class="current-page">{{currentPage}}</span>
                    <span class="total-pages">/ {{totalPages}}</span>
                </div>
                <button class="btn-page" [disabled]="currentPage === totalPages" 
                        (click)="changePage(currentPage + 1)">Next</button>
            </div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading products...</p>
      </div>
    </div>
  `,
    styles: [`
        .view-products-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
            min-height: 100vh;
        }

        .header-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 2rem;
            background: white;
            padding: 1.5rem 2rem;
            border-radius: 16px;
            box-shadow: var(--shadow-sm);
        }

        .header-section h1 {
            font-size: 1.75rem;
            color: var(--text-primary);
            margin: 0 0 0.5rem 0;
        }

        .subtitle {
            color: var(--text-secondary);
            margin: 0;
            font-size: 0.95rem;
        }

        .header-actions {
            display: flex;
            gap: 1rem;
            align-items: center;
        }

        .export-group {
            display: flex;
            gap: 0.5rem;
            background: #f8fafc;
            padding: 0.25rem;
            border-radius: 8px;
            border: 1px solid var(--border-color);
        }

        .format-select {
            border: none;
            background: transparent;
            font-size: 0.9rem;
            padding: 0 0.5rem;
            outline: none;
            cursor: pointer;
            color: var(--text-secondary);
        }

        .btn-refresh {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid var(--border-color);
            background: white;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .btn-refresh:hover {
            transform: rotate(180deg);
            background: #f8fafc;
        }

        .btn-icon-text {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
        }

        /* Filters */
        .filters-card {
            background: white;
            border-radius: 16px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border-color);
        }

        .filters-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }

        .filters-header h3 {
            font-size: 1.1rem;
            margin: 0;
            color: var(--text-primary);
        }

        .filters-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }

        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .filter-group label {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-secondary);
        }

        .form-input, .form-select {
            padding: 0.6rem;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            font-size: 0.9rem;
            transition: border-color 0.2s;
        }

        .form-input:focus, .form-select:focus {
            outline: none;
            border-color: var(--primary-color);
        }
        
        .btn-link {
            background: none;
            border: none;
            color: var(--primary-color);
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 500;
        }
        .btn-link:hover { text-decoration: underline; }

        /* Table */
        .table-card {
            background: white;
            border-radius: 16px;
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border-color);
            overflow: hidden;
        }

        .table-responsive {
            overflow-x: auto;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
        }

        .data-table th {
            padding: 1rem 1.5rem;
            text-align: left;
            font-weight: 600;
            color: var(--text-secondary);
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid var(--border-color);
            background: #f8fafc;
        }

        .data-table td {
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--border-color);
            color: var(--text-primary);
            font-size: 0.95rem;
            vertical-align: middle;
        }

        .data-table tr:last-child td { border-bottom: none; }
        .data-table tbody tr:hover { background: #f8fafc; }
        .data-table tr.row-inactive { opacity: 0.7; background: #fafafa; }

        .product-cell {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .product-thumb {
            width: 48px;
            height: 48px;
            border-radius: 8px;
            object-fit: cover;
            background: #f1f5f9;
        }

        .product-info {
            display: flex;
            flex-direction: column;
        }

        .product-name {
            font-weight: 600;
            color: var(--text-primary);
        }

        .product-desc {
            font-size: 0.8rem;
            color: var(--text-secondary);
        }

        .category-tag {
            background: #f1f5f9;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
            color: #475569;
        }

        .price-tag {
            font-weight: 600;
            color: var(--text-primary);
        }

        .stock-badge {
            font-size: 0.85rem;
            font-weight: 500;
        }
        .low-stock { color: #f59e0b; font-weight: 700; }
        .out-of-stock { color: #ef4444; font-weight: 700; }

        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        .status-badge.active { background: #dcfce7; color: #166534; }
        .status-badge.inactive { background: #f1f5f9; color: #475569; }
        .status-badge.deleted { background: #fee2e2; color: #991b1b; }

        .action-buttons {
            display: flex;
            gap: 0.5rem;
        }

        .btn-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            border: 1px solid transparent;
            background: transparent;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .btn-icon:hover { background: #f1f5f9; border-color: var(--border-color); }
        .btn-icon.delete:hover { background: #fee2e2; color: #991b1b; }
        .btn-icon.edit:hover { background: #e0f2fe; color: #0284c7; }

        /* Empty State */
        .empty-state {
            padding: 4rem;
            text-align: center;
            color: var(--text-secondary);
        }
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }

        /* Pagination */
        .pagination-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.5rem;
            border-top: 1px solid var(--border-color);
            background: #f8fafc;
        }

        .pagination-info {
            font-size: 0.9rem;
            color: var(--text-secondary);
        }

        .pagination-controls {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .btn-page {
            padding: 0.4rem 1rem;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            background: white;
            font-size: 0.9rem;
            cursor: pointer;
        }
        .btn-page:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-page:hover:not(:disabled) { background: #f1f5f9; }

        .page-numbers {
            font-weight: 600;
            color: var(--text-primary);
        }

        /* Loading */
        .loading-state {
            padding: 4rem;
            text-align: center;
            color: var(--text-secondary);
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .text-secondary { color: var(--text-secondary); }
    `]
})
export class ViewProductsComponent implements OnInit {
    products: any[] = [];
    filteredProducts: any[] = [];
    paginatedProducts: any[] = [];
    Math = Math; // Expose Math to template

    filters = {
        id: '',
        name: '',
        price: null,
        category: '',
        description: '',
        quantity: null
    };

    currentPage = 1;
    pageSize = 10;
    totalPages = 1;

    loading = false;
    downloadFormat = 'xlsx';

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        this.loading = true;
        this.http.get<any[]>('http://localhost:8080/api/admin/products/all',
            { withCredentials: true })
            .subscribe({
                next: (data) => {
                    this.products = data;
                    this.applyFilters();
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading products:', err);
                    this.loading = false;
                }
            });
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(p => {
            return (!this.filters.id || p.productId.toString().includes(this.filters.id)) &&
                (!this.filters.name || p.productName.toLowerCase().includes(this.filters.name.toLowerCase())) &&
                (!this.filters.price || p.price == this.filters.price) &&
                (!this.filters.category || p.category === this.filters.category) &&
                (!this.filters.description || p.description.toLowerCase().includes(this.filters.description.toLowerCase())) &&
                (!this.filters.quantity || p.quantityAvailable == this.filters.quantity);
        });

        this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
        this.currentPage = 1;
        this.updatePagination();
    }

    clearFilters() {
        this.filters = {
            id: '',
            name: '',
            price: null,
            category: '',
            description: '',
            quantity: null
        };
        this.applyFilters();
    }

    updatePagination() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.paginatedProducts = this.filteredProducts.slice(start, end);
    }

    changePage(page: number) {
        this.currentPage = page;
        this.updatePagination();
    }

    editProduct(product: any) {
        // Navigate to edit page or open modal
        alert('Edit functionality - Navigate to update product page with ID: ' + product.productId);
    }

    deleteProduct(product: any) {
        if (!confirm(`Are you sure you want to delete "${product.productName}"?`)) return;

        this.http.delete(`http://localhost:8080/api/admin/products/${product.productId}`,
            { withCredentials: true })
            .subscribe({
                next: () => {
                    alert('Product soft deleted successfully');
                    this.loadProducts();
                },
                error: (err) => {
                    alert('Error deleting product: ' + (err.error?.error || 'Unknown error'));
                }
            });
    }

    restoreProduct(product: any) {
        if (!confirm(`Restore "${product.productName}"?`)) return;

        this.http.post(`http://localhost:8080/api/admin/products/${product.productId}/restore`,
            {}, { withCredentials: true })
            .subscribe({
                next: () => {
                    alert('Product restored successfully');
                    this.loadProducts();
                },
                error: (err) => {
                    alert('Error restoring product: ' + (err.error?.error || 'Unknown error'));
                }
            });
    }

    downloadProducts() {
        const url = `http://localhost:8080/api/admin/products/download?format=${this.downloadFormat}`;
        window.open(url, '_blank');
    }
}
