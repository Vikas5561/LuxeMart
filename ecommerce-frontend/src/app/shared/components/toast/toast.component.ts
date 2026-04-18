import { Component, OnInit } from '@angular/core';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-toast',
    template: `
    <div *ngIf="toast$ | async as toast" class="toast-container" [ngClass]="toast.type">
      <div class="toast-content">
        <span class="icon" *ngIf="toast.type === 'success'">✅</span>
        <span class="icon" *ngIf="toast.type === 'error'">❌</span>
        <span class="icon" *ngIf="toast.type === 'info'">ℹ️</span>
        <span class="message">{{ toast.message }}</span>
      </div>
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      background: white;
      padding: 12px 24px;
      border-radius: 50px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideDown 0.3s ease-out;
      min-width: 300px;
      display: flex;
      justify-content: center;
    }

    .toast-content {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 500;
      font-size: 1rem;
    }

    .message {
      color: #1f2937;
    }

    /* Types */
    .success {
      border-left: 5px solid #10b981;
      background: #ecfdf5;
    }
    
    .success .message {
      color: #065f46;
    }

    .error {
      border-left: 5px solid #ef4444;
      background: #fef2f2;
    }

    .error .message {
      color: #991b1b;
    }

    .info {
      border-left: 5px solid #3b82f6;
      background: #eff6ff;
    }

    .info .message {
      color: #1e40af;
    }

    @keyframes slideDown {
      from {
        top: -100px;
        opacity: 0;
      }
      to {
        top: 20px;
        opacity: 1;
      }
    }
  `]
})
export class ToastComponent implements OnInit {
    toast$: Observable<ToastMessage | null>;

    constructor(private toastService: ToastService) {
        this.toast$ = this.toastService.toast$;
    }

    ngOnInit() { }
}
