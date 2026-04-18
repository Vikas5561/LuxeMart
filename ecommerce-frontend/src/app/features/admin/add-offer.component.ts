import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OfferService } from '../../core/services/offer.service';

@Component({
    selector: 'app-add-offer',
    template: `
    <div class="page-container fade-in">
      <div class="card">
        <h2>Add New Offer</h2>
        <form (ngSubmit)="onSubmit()" #offerForm="ngForm">
          <div class="form-group">
            <label>Offer Title</label>
            <input type="text" [(ngModel)]="offer.title" name="title" required class="form-input" placeholder="e.g. Summer Sale">
          </div>
          
          <div class="form-group">
            <label>Description</label>
            <textarea [(ngModel)]="offer.description" name="description" required class="form-input" rows="3" placeholder="Describe the offer..."></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Discount Code</label>
              <input type="text" [(ngModel)]="offer.discountCode" name="discountCode" required class="form-input" placeholder="SUMMER2026">
            </div>
            
            <div class="form-group">
              <label>Discount Percentage (%)</label>
              <input type="number" [(ngModel)]="offer.discountPercentage" name="discountPercentage" required min="1" max="100" class="form-input">
            </div>
          </div>
          
          <div class="actions">
            <button type="button" routerLink="/admin/offers" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="!offerForm.valid || submitting">
              {{submitting ? 'Creating...' : 'Create Offer'}}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .page-container { padding: 2rem; display: flex; justify-content: center; }
    .card {
      background: white; padding: 2.5rem; border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05); width: 100%; max-width: 600px;
    }
    h2 { margin-top: 0; margin-bottom: 2rem; color: #1e293b; }
    
    .form-group { margin-bottom: 1.5rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #475569; }
    .form-input {
      width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 8px;
      font-size: 1rem; transition: border-color 0.2s;
    }
    .form-input:focus { border-color: #2563eb; outline: none; }
    
    .actions { display: flex; gap: 1rem; margin-top: 2rem; justify-content: flex-end; }
    
    .btn {
      padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 500; cursor: pointer; border: none;
    }
    .btn-primary { background: #2563eb; color: white; }
    .btn-secondary { background: #e2e8f0; color: #475569; }
  `]
})
export class AddOfferComponent {
    offer = {
        title: '',
        description: '',
        discountCode: '',
        discountPercentage: null,
        status: 'Active'
    };
    submitting = false;

    constructor(
        private offerService: OfferService,
        private router: Router
    ) { }

    onSubmit() {
        this.submitting = true;
        this.offerService.createOffer(this.offer).subscribe({
            next: () => {
                this.router.navigate(['/admin/offers']);
            },
            error: (err) => {
                console.error(err);
                this.submitting = false;
                alert('Failed to create offer');
            }
        });
    }
}
