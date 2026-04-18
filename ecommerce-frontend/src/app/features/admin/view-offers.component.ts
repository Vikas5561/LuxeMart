import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../core/services/offer.service';

@Component({
    selector: 'app-view-offers',
    template: `
    <div class="page-container fade-in">
      <div class="page-header">
        <h1>Manage Offers</h1>
        <a routerLink="/admin/offers/add" class="btn btn-primary">
          <span class="icon">➕</span> Add New Offer
        </a>
      </div>
      
      <div class="card-grid">
        <div class="offer-card" *ngFor="let offer of offers">
          <div class="offer-header">
            <span class="discount-badge">{{offer.discountPercentage}}% OFF</span>
            <button class="delete-btn" (click)="deleteOffer(offer.id)" title="Delete Offer">🗑️</button>
          </div>
          <h3>{{offer.title}}</h3>
          <p class="desc">{{offer.description}}</p>
          <div class="code-box">
            Code: <strong>{{offer.discountCode}}</strong>
          </div>
          <div class="status-row">
            <span class="status-pill" [class.active]="offer.status === 'Active'">{{offer.status}}</span>
          </div>
        </div>
      </div>
      
      <div *ngIf="offers.length === 0" class="empty-state">
        <p>No offers found. Create one to boost sales!</p>
      </div>
    </div>
  `,
    styles: [`
    .page-container { padding: 2rem; }
    .page-header { 
      display: flex; justify-content: space-between; align-items: center; 
      margin-bottom: 2rem;
    }
    .card-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .offer-card {
      background: white; border-radius: 12px; padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      border: 1px solid #e2e8f0;
      position: relative;
    }
    .offer-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 1rem;
    }
    .discount-badge {
      background: #dcfce7; color: #166534;
      padding: 0.25rem 0.75rem; border-radius: 20px;
      font-weight: bold; font-size: 0.9rem;
    }
    .delete-btn {
      background: none; border: none; cursor: pointer; font-size: 1.1rem;
      opacity: 0.6; transition: opacity 0.2s;
    }
    .delete-btn:hover { opacity: 1; color: #ef4444; }
    
    h3 { margin: 0 0 0.5rem; color: #1e293b; font-size: 1.25rem; }
    .desc { color: #64748b; margin-bottom: 1rem; font-size: 0.95rem; }
    
    .code-box {
      background: #f1f5f9; padding: 0.75rem; border-radius: 8px;
      text-align: center; font-family: monospace; font-size: 1.1rem;
      color: #0f172a; margin-bottom: 1rem; border: 1px dashed #cbd5e1;
    }
    
    .status-pill {
      font-size: 0.8rem; padding: 0.25rem 0.5rem; border-radius: 4px;
      background: #e2e8f0; color: #64748b;
    }
    .status-pill.active { background: #dbeafe; color: #1e40af; }
    
    .empty-state { text-align: center; padding: 4rem; color: #94a3b8; }
    
    .btn {
      padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none;
      display: inline-flex; align-items: center; gap: 0.5rem;
      font-weight: 500; cursor: pointer; border: none;
    }
    .btn-primary { background: #2563eb; color: white; }
    .btn-primary:hover { background: #1d4ed8; }
  `]
})
export class ViewOffersComponent implements OnInit {
    offers: any[] = [];

    constructor(private offerService: OfferService) { }

    ngOnInit() {
        this.loadOffers();
    }

    loadOffers() {
        this.offerService.getAllOffers().subscribe(data => {
            this.offers = data;
        });
    }

    deleteOffer(id: number) {
        if (confirm('Are you sure you want to delete this offer?')) {
            this.offerService.deleteOffer(id).subscribe(() => {
                this.loadOffers();
            });
        }
    }
}
