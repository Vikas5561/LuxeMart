import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-customers',
  template: `
    <div class="view-customers-container fade-in">
      <div class="header-section">
        <div>
            <h1>👥 Customer Management</h1>
            <p class="subtitle">View and manage your registered customers.</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="loadCustomers()">🔄 Refresh List</button>
          
          <div class="export-group" *ngIf="customers.length > 0">
              <select [(ngModel)]="downloadFormat" class="format-select">
                <option value="xlsx">Excel (.xlsx)</option>
                <option value="pdf">PDF</option>
              </select>
              <button class="btn btn-secondary btn-icon" (click)="downloadCustomers()" title="Download">
                📥
              </button>
          </div>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="filters-card">
        <div class="search-box">
            <span class="search-icon">🔍</span>
            <input type="text" [(ngModel)]="searchQuery" (input)="applySearch()" 
                   placeholder="Search customers by name, email, phone, or location..." 
                   class="search-input">
            <button class="btn-clear" *ngIf="searchQuery" (click)="clearSearch()">×</button>
        </div>
      </div>

      <!-- Customers Table -->
      <div class="table-card" *ngIf="!loading">
        <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let customer of paginatedCustomers">
                  <td><span class="id-badge">#{{customer.customerId}}</span></td>
                  <td>
                    <div class="customer-cell">
                        <div class="avatar">{{(customer.name?.charAt(0) || 'U') | uppercase}}</div>
                        <div class="info">
                            <span class="name">{{customer.name}}</span>
                            <span class="username">&#64;{{customer.username || 'user'}}</span>
                        </div>
                    </div>
                  </td>
                  <td>
                    <div class="contact-info">
                        <div class="contact-item" *ngIf="customer.email">
                            <span class="icon">📧</span> {{customer.email}}
                        </div>
                        <div class="contact-item" *ngIf="customer.phone">
                            <span class="icon">📱</span> {{customer.phone}}
                        </div>
                    </div>
                  </td>
                  <td>
                    <div class="location-info" *ngIf="customer.city || customer.state">
                        <span class="icon">📍</span> 
                        {{customer.city}}{{customer.city && customer.state ? ', ' : ''}}{{customer.state}}
                        <div class="country" *ngIf="customer.country">{{customer.country}}</div>
                    </div>
                    <span class="text-muted" *ngIf="!customer.city && !customer.state">N/A</span>
                  </td>
                  <td>{{customer.createdAt | date:'mediumDate'}}</td>
                  <td>
                    <button class="btn-icon" title="View Details" (click)="viewCustomerDetails(customer)">
                        👁️
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
        </div>

        <div *ngIf="filteredCustomers.length === 0" class="empty-state">
          <div class="empty-icon">👥</div>
          <h3>No customers found</h3>
          <p *ngIf="searchQuery">No results matching "{{searchQuery}}"</p>
        </div>

        <!-- Pagination -->
        <div class="pagination-wrapper" *ngIf="filteredCustomers.length > 0">
            <div class="pagination-info">
                Showing {{ (currentPage - 1) * pageSize + 1 }} - 
                {{ Math.min(currentPage * pageSize, filteredCustomers.length) }} 
                of {{ filteredCustomers.length }} customers
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
        <p>Loading customer registry...</p>
      </div>
    </div>
  `,
  styles: [`
        .view-customers-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
            min-height: 100vh;
        }

        .header-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
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
            background: white;
            padding: 0.25rem;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            align-items: center;
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

        /* Search & Filters */
        .filters-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border-color);
        }

        .search-box {
            display: flex;
            align-items: center;
            background: #f8fafc;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 0.5rem 1rem;
            max-width: 600px;
            transition: all 0.2s;
        }

        .search-box:focus-within {
            border-color: var(--primary-color);
            background: white;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .search-icon { font-size: 1.1rem; color: var(--text-secondary); margin-right: 0.75rem; }
        
        .search-input {
            border: none;
            background: transparent;
            font-size: 0.95rem;
            flex: 1;
            outline: none;
            color: var(--text-primary);
        }

        .btn-clear {
            background: none;
            border: none;
            font-size: 1.2rem;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 0 0.25rem;
        }
        .btn-clear:hover { color: #dc2626; }

        /* Table */
        .table-card {
            background: white;
            border-radius: 16px;
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border-color);
            overflow: hidden;
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
            background: #f8fafc;
            border-bottom: 1px solid var(--border-color);
        }

        .data-table td {
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--border-color);
            color: var(--text-primary);
            font-size: 0.95rem;
            vertical-align: middle;
        }

        .data-table tbody tr:hover { background: #f8fafc; }

        .id-badge {
            font-family: monospace;
            background: #f1f5f9;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.85rem;
        }

        .customer-cell {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .avatar {
            width: 40px; height: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-weight: 600;
            font-size: 1.1rem;
        }

        .info { display: flex; flex-direction: column; }
        .name { font-weight: 600; color: var(--text-primary); }
        .username { font-size: 0.8rem; color: var(--text-secondary); }

        .contact-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            margin-bottom: 0.25rem;
        }
        .contact-item .icon { font-size: 1rem; }

        .location-info { font-size: 0.9rem; }
        .location-info .country { font-size: 0.8rem; color: var(--text-secondary); margin-left: 1.4rem; }

        .btn-icon {
            width: 36px; height: 36px;
            border-radius: 8px;
            border: 1px solid transparent;
            background: transparent;
            cursor: pointer;
            transition: all 0.2s;
            display: flex; align-items: center; justify-content: center;
        }
        .btn-icon:hover { background: #f1f5f9; border-color: var(--border-color); }

        /* Pagination */
        .pagination-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.5rem;
            border-top: 1px solid var(--border-color);
            background: #f8fafc;
        }

        .pagination-info { font-size: 0.9rem; color: var(--text-secondary); }

        .pagination-controls { display: flex; align-items: center; gap: 1rem; }

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

        .page-numbers { font-weight: 600; color: var(--text-primary); }

        .empty-state {
            padding: 4rem;
            text-align: center;
            color: var(--text-secondary);
        }
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }

        .loading-state {
            padding: 4rem;
            text-align: center;
            color: var(--text-secondary);
        }
        .spinner {
            width: 40px; height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .text-muted { color: #94a3b8; font-style: italic; }
    `]
})
export class ViewCustomersComponent implements OnInit {
  customers: any[] = [];
  filteredCustomers: any[] = [];
  paginatedCustomers: any[] = [];
  Math = Math;

  searchQuery = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  loading = false;
  downloadFormat = 'xlsx';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:8080/api/admin/customers',
      { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.customers = data;
          this.applySearch();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading customers:', err);
          this.loading = false;
        }
      });
  }

  applySearch() {
    const query = this.searchQuery.toLowerCase();

    if (!query) {
      this.filteredCustomers = [...this.customers];
    } else {
      this.filteredCustomers = this.customers.filter(c =>
        c.customerId?.toString().includes(query) ||
        c.name?.toLowerCase().includes(query) ||
        c.country?.toLowerCase().includes(query) ||
        c.state?.toLowerCase().includes(query) ||
        c.city?.toLowerCase().includes(query) ||
        c.phone?.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query)
      );
    }

    this.totalPages = Math.ceil(this.filteredCustomers.length / this.pageSize);
    this.currentPage = 1;
    this.updatePagination();
  }

  clearSearch() {
    this.searchQuery = '';
    this.applySearch();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedCustomers = this.filteredCustomers.slice(start, end);
  }

  changePage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  downloadCustomers() {
    const url = `http://localhost:8080/api/admin/customers/download?format=${this.downloadFormat}`;
    window.open(url, '_blank');
  }

  viewCustomerDetails(customer: any) {
    alert('View details for: ' + customer.name);
  }
}
