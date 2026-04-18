import { Component, OnInit } from '@angular/core';
import { FeedbackService, Feedback } from '../../core/services/feedback.service';

@Component({
    selector: 'app-view-feedback',
    template: `
        <div class="view-feedback-container fade-in">
            <div class="header-section">
                <div>
                    <h1>💬 Customer Feedback</h1>
                    <p class="subtitle">Insights and reviews from your customers.</p>
                </div>
                <div class="header-actions">
                     <button class="btn btn-primary" (click)="loadAllFeedback()">🔄 Refresh</button>
                </div>
            </div>

            <!-- Stats / Filter Tabs -->
            <div class="feedback-stats">
               <button class="stat-tab" [class.active]="selectedFilter === 'all'" (click)="filterByRating('all')">
                   <span class="label">All Reviews</span>
                   <span class="count">{{feedbacks.length}}</span>
               </button>
               <button class="stat-tab" [class.active]="selectedFilter === 5" (click)="filterByRating(5)">
                   <span class="label">⭐⭐⭐⭐⭐</span>
                   <span class="count">{{getCountByRating(5)}}</span>
               </button>
               <button class="stat-tab" [class.active]="selectedFilter === 4" (click)="filterByRating(4)">
                   <span class="label">⭐⭐⭐⭐</span>
                   <span class="count">{{getCountByRating(4)}}</span>
               </button>
               <button class="stat-tab" [class.active]="selectedFilter === 3" (click)="filterByRating(3)">
                   <span class="label">⭐⭐⭐</span>
                   <span class="count">{{getCountByRating(3)}}</span>
               </button>
               <button class="stat-tab warning" [class.active]="selectedFilter === 2" (click)="filterByRating(2)">
                   <span class="label">⭐⭐</span>
                   <span class="count">{{getCountByRating(2)}}</span>
               </button>
               <button class="stat-tab danger" [class.active]="selectedFilter === 1" (click)="filterByRating(1)">
                   <span class="label">⭐</span>
                   <span class="count">{{getCountByRating(1)}}</span>
               </button>
            </div>

            <!-- Search -->
            <div class="filters-card">
                 <div class="search-box">
                    <span class="search-icon">🔍</span>
                    <input type="text" [(ngModel)]="searchQuery" (input)="applySearch()" 
                           placeholder="Search by Order ID, Customer Name, or Feedback Content..." 
                           class="search-input">
                </div>
            </div>

            <!-- Feedback Grid / List -->
            <div class="feedback-grid" *ngIf="!loading">
                <div class="feedback-card" *ngFor="let feedback of paginatedFeedbacks">
                    <div class="card-header">
                        <div class="user-info">
                            <div class="avatar">{{(feedback.customerName.charAt(0) || 'U') | uppercase}}</div>
                            <div>
                                <h4 class="username">{{feedback.customerName}}</h4>
                                <span class="customer-id">ID: {{feedback.customerId}}</span>
                            </div>
                        </div>
                        <div class="order-ref">
                            <span class="label">Order #{{feedback.orderId}}</span>
                            <span class="date">{{feedback.createdAt | date:'mediumDate'}}</span>
                        </div>
                    </div>
                    
                    <div class="rating-display">
                        <div class="stars">
                            <span *ngFor="let star of [1,2,3,4,5]" 
                                  [class.filled]="star <= feedback.rating">★</span>
                        </div>
                        <span class="rating-badge" [ngClass]="getRatingClass(feedback.rating)">
                            {{feedback.rating}}/5
                        </span>
                    </div>

                    <div class="feedback-content">
                        <p>"{{feedback.description}}"</p>
                    </div>

                    <div class="card-footer">
                        <button class="btn-link">Reply to Customer</button>
                        <button class="btn-link text-danger">Report Issue</button>
                    </div>
                </div>
            </div>
            
            <div *ngIf="!loading && filteredFeedbacks.length === 0" class="empty-state">
                <div class="empty-icon">📭</div>
                <h3>No feedback found</h3>
                <p>Try adjusting your filters or search query</p>
            </div>

            <div *ngIf="loading" class="loading-state">
                <div class="spinner"></div>
                <p>Loading reviews...</p>
            </div>

            <!-- Pagination -->
            <div class="pagination-wrapper" *ngIf="filteredFeedbacks.length > itemsPerPage">
                 <div class="pagination-info">
                    Showing {{ (currentPage - 1) * itemsPerPage + 1 }} - 
                    {{ Math.min(currentPage * itemsPerPage, filteredFeedbacks.length) }} 
                    of {{ filteredFeedbacks.length }} reviews
                </div>
                <div class="pagination-controls">
                    <button class="btn-page" [disabled]="currentPage === 1" 
                            (click)="changePage(currentPage - 1)">Previous</button>
                    <span class="page-numbers">{{currentPage}} / {{totalPages}}</span>
                    <button class="btn-page" [disabled]="currentPage === totalPages" 
                            (click)="changePage(currentPage + 1)">Next</button>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .view-feedback-container {
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

        .header-section h1 { font-size: 1.75rem; margin: 0 0 0.5rem 0; color: var(--text-primary); }
        .subtitle { color: var(--text-secondary); margin: 0; }

        /* Stats / Tabs */
        .feedback-stats {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }

        .stat-tab {
            flex: 1;
            min-width: 120px;
            background: white;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: var(--shadow-sm);
        }

        .stat-tab:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .stat-tab.active { border-color: var(--primary-color); background: #eff6ff; }
        
        .stat-tab .label { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.25rem; }
        .stat-tab .count { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); }

        .stat-tab.warning.active { background: #fffbeb; border-color: #f59e0b; }
        .stat-tab.danger.active { background: #fef2f2; border-color: #ef4444; }

        /* Filters */
        .filters-card {
            background: white;
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 2rem;
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
        }
        .search-box:focus-within { border-color: var(--primary-color); background: white; }
        .search-icon { font-size: 1.1rem; margin-right: 0.5rem; opacity: 0.6; }
        .search-input { border: none; background: transparent; flex: 1; outline: none; font-size: 0.95rem; }

        /* Grid */
        .feedback-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 1.5rem;
        }

        .feedback-card {
            background: white;
            border-radius: 16px;
            padding: 1.5rem;
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            transition: transform 0.2s;
        }
        
        .feedback-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }

        .user-info { display: flex; gap: 0.75rem; }
        .avatar {
            width: 40px; height: 40px;
            background: #e0f2fe; color: #0284c7;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-weight: 600;
        }
        .username { margin: 0; font-size: 1rem; font-weight: 600; }
        .customer-id { font-size: 0.75rem; color: var(--text-secondary); }

        .order-ref { text-align: right; display: flex; flex-direction: column; }
        .order-ref .label { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); }
        .order-ref .date { font-size: 0.75rem; color: var(--text-secondary); }

        .rating-display {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px dashed var(--border-color);
        }

        .stars { color: #cbd5e1; font-size: 1.2rem; }
        .stars .filled { color: #f59e0b; }
        
        .rating-badge {
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 700;
        }
        .rating-high { background: #dcfce7; color: #166534; }
        .rating-med { background: #fef3c7; color: #92400e; }
        .rating-low { background: #fee2e2; color: #991b1b; }

        .feedback-content {
            flex: 1;
            margin-bottom: 1.5rem;
        }
        .feedback-content p {
            margin: 0;
            line-height: 1.5;
            color: var(--text-primary);
            font-style: italic;
        }

        .card-footer {
            display: flex;
            justify-content: space-between;
            margin-top: auto;
        }

        .btn-link {
            background: none; border: none;
            color: var(--primary-color);
            font-size: 0.85rem; font-weight: 500;
            cursor: pointer; padding: 0;
        }
        .btn-link:hover { text-decoration: underline; }
        .text-danger { color: #ef4444; }

        /* States */
        .loading-state, .empty-state { text-align: center; padding: 4rem; color: var(--text-secondary); }
        .spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top-color: var(--primary-color); border-radius: 50%; animation: spin 1s infinite; margin: 0 auto 1rem; }
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Pagination */
        .pagination-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            margin-top: 2rem;
            border-top: 1px solid var(--border-color);
        }
        .pagination-info { font-size: 0.9rem; color: var(--text-secondary); }
        .pagination-controls { display: flex; align-items: center; gap: 1rem; }
        .btn-page {
            padding: 0.4rem 1rem;
            border: 1px solid var(--border-color);
            background: white; border-radius: 6px;
            cursor: pointer;
        }
        .btn-page:disabled { opacity: 0.5; }
        .page-numbers { font-weight: 600; }
    `]
})
export class ViewFeedbackComponent implements OnInit {
    feedbacks: Feedback[] = [];
    filteredFeedbacks: Feedback[] = [];
    paginatedFeedbacks: Feedback[] = [];
    Math = Math;

    selectedFilter: number | 'all' = 'all';
    searchQuery = '';
    loading = false;

    // Pagination
    currentPage = 1;
    itemsPerPage = 10;
    totalPages = 1;

    constructor(private feedbackService: FeedbackService) { }

    ngOnInit() {
        this.loadAllFeedback();
    }

    loadAllFeedback() {
        this.loading = true;
        this.feedbackService.getAllFeedback().subscribe({
            next: (data) => {
                this.feedbacks = data.sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                });
                this.filteredFeedbacks = [...this.feedbacks];
                this.updatePagination();
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading feedback:', err);
                this.loading = false;
            }
        });
    }

    filterByRating(rating: number | 'all') {
        this.selectedFilter = rating;
        this.currentPage = 1;
        this.searchQuery = ''; // Reset search when changing tab

        if (rating === 'all') {
            this.filteredFeedbacks = [...this.feedbacks];
        } else {
            this.filteredFeedbacks = this.feedbacks.filter(f => f.rating === rating);
        }
        this.updatePagination();
    }

    applySearch() {
        let temp = this.feedbacks;

        // Apply rating filter first if not 'all'
        if (this.selectedFilter !== 'all') {
            temp = temp.filter(f => f.rating === this.selectedFilter);
        }

        if (!this.searchQuery.trim()) {
            this.filteredFeedbacks = [...temp];
        } else {
            const query = this.searchQuery.toLowerCase();
            this.filteredFeedbacks = temp.filter(fb =>
                fb.orderId.toString().includes(query) ||
                fb.customerId.toLowerCase().includes(query) ||
                fb.customerName.toLowerCase().includes(query) ||
                fb.description.toLowerCase().includes(query)
            );
        }
        this.currentPage = 1;
        this.updatePagination();
    }

    getCountByRating(rating: number): number {
        return this.feedbacks.filter(f => f.rating === rating).length;
    }

    updatePagination() {
        this.totalPages = Math.ceil(this.filteredFeedbacks.length / this.itemsPerPage);
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        this.paginatedFeedbacks = this.filteredFeedbacks.slice(start, end);
    }

    changePage(page: number) {
        this.currentPage = page;
        this.updatePagination();
    }

    getRatingClass(rating: number): string {
        if (rating >= 4) return 'rating-high';
        if (rating >= 3) return 'rating-med';
        return 'rating-low';
    }
}
