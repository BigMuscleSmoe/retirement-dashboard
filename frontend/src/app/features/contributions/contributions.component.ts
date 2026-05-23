import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Account, Contribution, PageResponse, CreateContributionRequest } from '../../core/api.service';

@Component({
  selector: 'app-contributions',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, FormsModule],
  template: `
    <div class="contributions-page">
      <header class="page-header">
        <h1>Contribution History</h1>
        <button class="btn-add" (click)="openModal()">+ Add Contribution</button>
      </header>

      <div class="loading" *ngIf="loading">Loading contributions...</div>

      <ng-container *ngIf="!loading">
        <div class="table-card">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Employer</th>
                <th>Total</th>
                <th>Pay Period</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of contributions">
                <td>{{ c.contributionDate | date:'mediumDate' }}</td>
                <td class="amount">{{ c.employeeAmount | currency }}</td>
                <td class="amount">{{ c.employerAmount | currency }}</td>
                <td class="amount total">{{ c.employeeAmount + c.employerAmount | currency }}</td>
                <td><span class="badge">{{ c.payPeriod }}</span></td>
              </tr>
              <tr *ngIf="contributions.length === 0">
                <td colspan="5" class="empty">No contributions found</td>
              </tr>
            </tbody>
          </table>

          <div class="pagination" *ngIf="totalPages > 1">
            <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 0">Previous</button>
            <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
            <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage >= totalPages - 1">Next</button>
          </div>
        </div>
      </ng-container>

      <!-- Add Contribution Modal -->
      <div class="modal-backdrop" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <h3>Add Contribution</h3>
          <div class="modal-error" *ngIf="modalError">{{ modalError }}</div>
          <form (ngSubmit)="submitContribution()">
            <div class="form-group">
              <label>Date</label>
              <input type="date" [(ngModel)]="newContribution.contributionDate" name="date" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Employee Amount ($)</label>
                <input type="number" [(ngModel)]="newContribution.employeeAmount" name="employeeAmount" min="0.01" step="0.01" required>
              </div>
              <div class="form-group">
                <label>Employer Amount ($)</label>
                <input type="number" [(ngModel)]="newContribution.employerAmount" name="employerAmount" min="0" step="0.01" required>
              </div>
            </div>
            <div class="form-group">
              <label>Pay Period</label>
              <select [(ngModel)]="newContribution.payPeriod" name="payPeriod" required>
                <option value="BIWEEKLY">Biweekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="WEEKLY">Weekly</option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-cancel" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn-primary" [disabled]="saving">
                {{ saving ? 'Saving...' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contributions-page { padding: 32px; max-width: 1000px; margin: 0 auto; }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }
    .page-header h1 { margin: 0; font-size: 1.75rem; font-weight: 700; color: #0f172a; }
    .btn-add {
      padding: 10px 20px;
      background: #0f172a;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-add:hover { background: #1e293b; }
    .loading { text-align: center; padding: 64px; color: #64748b; }
    .table-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    table { width: 100%; border-collapse: collapse; }
    th {
      text-align: left;
      padding: 14px 20px;
      background: #f8fafc;
      color: #64748b;
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e2e8f0;
    }
    td {
      padding: 14px 20px;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
    }
    .amount { font-variant-numeric: tabular-nums; font-weight: 500; }
    .total { color: #0f172a; font-weight: 600; }
    .badge {
      background: #f0f9ff;
      color: #0369a1;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .empty { text-align: center; color: #94a3b8; padding: 48px 20px; }
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 16px;
      border-top: 1px solid #e2e8f0;
    }
    .pagination button {
      padding: 8px 16px;
      border: 1px solid #e2e8f0;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }
    .pagination button:hover:not(:disabled) { background: #f8fafc; }
    .pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
    .pagination span { color: #64748b; font-size: 0.9rem; }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-card {
      background: white;
      border-radius: 16px;
      padding: 32px;
      width: 100%;
      max-width: 480px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
    }
    .modal-card h3 { margin: 0 0 24px; font-size: 1.25rem; font-weight: 700; color: #0f172a; }
    .modal-error {
      background: #fef2f2;
      color: #dc2626;
      padding: 10px 14px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 0.85rem;
    }
    .form-group { margin-bottom: 16px; }
    .form-group label {
      display: block;
      font-weight: 500;
      margin-bottom: 6px;
      color: #334155;
      font-size: 0.85rem;
    }
    .form-group input, .form-group select {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      box-sizing: border-box;
    }
    .form-group input:focus, .form-group select:focus {
      outline: none;
      border-color: #38bdf8;
      box-shadow: 0 0 0 3px rgba(56,189,248,0.15);
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }
    .btn-cancel {
      padding: 10px 20px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      color: #334155;
    }
    .btn-cancel:hover { background: #f8fafc; }
    .btn-primary {
      padding: 10px 20px;
      background: #0f172a;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-primary:hover { background: #1e293b; }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
  `]
})
export class ContributionsComponent implements OnInit {
  contributions: Contribution[] = [];
  loading = true;
  currentPage = 0;
  totalPages = 0;
  accountId = '';

  showModal = false;
  saving = false;
  modalError = '';
  newContribution = {
    contributionDate: '',
    employeeAmount: 750,
    employerAmount: 300,
    payPeriod: 'BIWEEKLY'
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAccounts().subscribe(accounts => {
      if (accounts.length > 0) {
        this.accountId = accounts[0].id;
        this.loadPage(0);
      } else {
        this.loading = false;
      }
    });
  }

  goToPage(page: number): void {
    this.loadPage(page);
  }

  openModal(): void {
    this.newContribution = {
      contributionDate: new Date().toISOString().split('T')[0],
      employeeAmount: 750,
      employerAmount: 300,
      payPeriod: 'BIWEEKLY'
    };
    this.modalError = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.modalError = '';
  }

  submitContribution(): void {
    this.saving = true;
    this.modalError = '';
    this.api.createContribution(this.accountId, this.newContribution as any).subscribe({
      next: () => {
        this.saving = false;
        this.showModal = false;
        this.loadPage(0);
      },
      error: (err) => {
        this.modalError = err.error?.message || 'Failed to save contribution';
        this.saving = false;
      }
    });
  }

  private loadPage(page: number): void {
    this.loading = true;
    this.api.getContributions(this.accountId, page, 15).subscribe({
      next: (res) => {
        this.contributions = res.content;
        this.currentPage = res.number;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
