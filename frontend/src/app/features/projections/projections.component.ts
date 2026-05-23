import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, ProjectionResponse } from '../../core/api.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-projections',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  template: `
    <div class="projections-page">
      <header class="page-header">
        <h1>Retirement Projections</h1>
        <p>Model your future retirement balance</p>
      </header>

      <div class="content-grid">
        <div class="form-card">
          <h3>Projection Parameters</h3>
          <form (ngSubmit)="calculate()">
            <div class="form-group">
              <label>Current Age</label>
              <input type="number" [(ngModel)]="params.currentAge" name="currentAge" min="18" max="80">
            </div>
            <div class="form-group">
              <label>Retirement Age</label>
              <input type="number" [(ngModel)]="params.retirementAge" name="retirementAge" min="50" max="80">
            </div>
            <div class="form-group">
              <label>Expected Annual Return (%)</label>
              <input type="number" [(ngModel)]="params.expectedReturnRate" name="returnRate" step="0.1" min="0" max="20">
            </div>
            <div class="form-group">
              <label>Annual Contribution ($)</label>
              <input type="number" [(ngModel)]="params.annualContribution" name="contribution" min="0">
            </div>
            <div class="form-group">
              <label>Current Balance ($)</label>
              <input type="number" [(ngModel)]="params.currentBalance" name="balance" min="0">
            </div>
            <button type="submit" [disabled]="loading" class="btn-primary">
              {{ loading ? 'Calculating...' : 'Calculate Projection' }}
            </button>
          </form>
        </div>

        <div class="results-section">
          <ng-container *ngIf="result">
            <div class="result-cards">
              <div class="result-card">
                <span class="label">Projected Balance at Retirement</span>
                <span class="value">{{ result.projectedBalance | currency }}</span>
              </div>
              <div class="result-card">
                <span class="label">Estimated Monthly Income (4% Rule)</span>
                <span class="value">{{ result.estimatedMonthlyIncome | currency }}</span>
              </div>
            </div>
            <div class="chart-card">
              <h3>Growth Projection</h3>
              <canvas #projectionChart></canvas>
            </div>
          </ng-container>

          <div class="empty-state" *ngIf="!result">
            <p>Enter your parameters and click Calculate to see your retirement projection.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .projections-page { padding: 32px; max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 32px; }
    .page-header h1 { margin: 0; font-size: 1.75rem; font-weight: 700; color: #0f172a; }
    .page-header p { color: #64748b; margin: 4px 0 0; }

    .content-grid {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 24px;
      align-items: start;
    }
    .form-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .form-card h3 { margin: 0 0 20px; font-size: 1rem; color: #334155; }
    .form-group { margin-bottom: 16px; }
    .form-group label {
      display: block;
      font-weight: 500;
      margin-bottom: 6px;
      color: #334155;
      font-size: 0.85rem;
    }
    .form-group input {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      box-sizing: border-box;
    }
    .form-group input:focus { outline: none; border-color: #38bdf8; box-shadow: 0 0 0 3px rgba(56,189,248,0.15); }
    .btn-primary {
      width: 100%;
      padding: 12px;
      background: #0f172a;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 8px;
    }
    .btn-primary:hover { background: #1e293b; }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

    .result-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .result-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      display: flex;
      flex-direction: column;
    }
    .result-card .label { font-size: 0.85rem; color: #64748b; font-weight: 500; margin-bottom: 8px; }
    .result-card .value { font-size: 1.5rem; font-weight: 700; color: #0f172a; }
    .chart-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .chart-card h3 { margin: 0 0 16px; font-size: 1rem; color: #334155; }
    .empty-state {
      background: white;
      border-radius: 12px;
      padding: 64px 24px;
      text-align: center;
      color: #94a3b8;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    @media (max-width: 768px) {
      .content-grid { grid-template-columns: 1fr; }
      .result-cards { grid-template-columns: 1fr; }
    }
  `]
})
export class ProjectionsComponent {
  @ViewChild('projectionChart') chartRef!: ElementRef<HTMLCanvasElement>;

  params = {
    currentAge: 30,
    retirementAge: 65,
    expectedReturnRate: 7.0,
    annualContribution: 19500,
    currentBalance: 50000
  };

  result: ProjectionResponse | null = null;
  loading = false;
  private chart: Chart | null = null;

  constructor(private api: ApiService) {}

  calculate(): void {
    this.loading = true;
    this.api.calculateProjection(this.params).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
        setTimeout(() => this.renderChart(), 0);
      },
      error: () => { this.loading = false; }
    });
  }

  private renderChart(): void {
    if (!this.chartRef || !this.result) return;
    if (this.chart) this.chart.destroy();

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: this.result.yearByYear.map(y => `Age ${y.age}`),
        datasets: [{
          label: 'Projected Balance',
          data: this.result.yearByYear.map(y => y.balance),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 2,
          pointBackgroundColor: '#10b981'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => '$' + Number(ctx.raw).toLocaleString()
            }
          }
        },
        scales: {
          y: {
            ticks: { callback: (v) => '$' + (Number(v) / 1000).toFixed(0) + 'K' }
          }
        }
      }
    });
  }
}
