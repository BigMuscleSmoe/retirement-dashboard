import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ApiService, Account, BalanceHistory, AssetAllocation, ContributionSummary, Contribution, PageResponse } from '../../core/api.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, DecimalPipe],
  template: `
    <div class="dashboard">
      <header class="page-header">
        <h1>Dashboard</h1>
        <p class="date">{{ today | date:'fullDate' }}</p>
      </header>

      <div class="loading" *ngIf="loading">Loading your retirement data...</div>

      <ng-container *ngIf="!loading && account">
        <!-- Hero Cards -->
        <div class="cards-grid">
          <div class="card hero-card">
            <span class="card-label">Total Balance</span>
            <span class="card-value">{{ account.currentBalance | currency }}</span>
            <span class="card-sub">{{ account.accountName }}</span>
          </div>
          <div class="card">
            <span class="card-label">YTD Contributions</span>
            <span class="card-value">{{ summary?.ytdTotal | currency }}</span>
            <span class="card-sub">of {{ summary?.irsLimit | currency }} limit</span>
          </div>
          <div class="card">
            <span class="card-label">Employer Match</span>
            <span class="card-value">{{ account.employerMatchPct | number:'1.0-1' }}%</span>
            <span class="card-sub">{{ summary?.ytdEmployerTotal | currency }} YTD</span>
          </div>
          <div class="card">
            <span class="card-label">Remaining Allowance</span>
            <span class="card-value">{{ summary?.remainingAllowance | currency }}</span>
            <span class="card-sub">before IRS limit</span>
          </div>
        </div>

        <!-- Charts -->
        <div class="charts-grid">
          <div class="chart-card">
            <h3>Balance Over Time</h3>
            <canvas #balanceChart></canvas>
          </div>
          <div class="chart-card allocation-chart">
            <h3>Asset Allocation</h3>
            <canvas #allocationChart></canvas>
          </div>
        </div>

        <!-- YTD Progress Bar -->
        <div class="progress-section">
          <h3>YTD Contribution Progress</h3>
          <div class="progress-bar-container">
            <div class="progress-bar" [style.width.%]="contributionPct"></div>
          </div>
          <div class="progress-labels">
            <span>{{ summary?.ytdEmployeeTotal | currency }} employee</span>
            <span>{{ contributionPct | number:'1.0-1' }}% of limit</span>
          </div>
        </div>

        <!-- Recent Contributions -->
        <div class="recent-section" *ngIf="recentContributions.length > 0">
          <h3>Recent Contributions</h3>
          <table class="recent-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Employer</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of recentContributions">
                <td>{{ c.contributionDate | date:'mediumDate' }}</td>
                <td class="amount">{{ c.employeeAmount | currency }}</td>
                <td class="amount">{{ c.employerAmount | currency }}</td>
                <td class="amount total">{{ c.employeeAmount + c.employerAmount | currency }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .dashboard { padding: 32px; max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 32px; }
    .page-header h1 { margin: 0; font-size: 1.75rem; font-weight: 700; color: #0f172a; }
    .date { margin: 4px 0 0; color: #64748b; }
    .loading { text-align: center; padding: 64px; color: #64748b; font-size: 1.1rem; }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      display: flex;
      flex-direction: column;
    }
    .hero-card {
      background: linear-gradient(135deg, #0f172a, #1e3a5f);
      color: white;
    }
    .hero-card .card-label { color: rgba(255,255,255,0.7); }
    .hero-card .card-sub { color: rgba(255,255,255,0.5); }
    .card-label { font-size: 0.85rem; color: #64748b; font-weight: 500; margin-bottom: 8px; }
    .card-value { font-size: 1.75rem; font-weight: 700; color: #0f172a; }
    .hero-card .card-value { color: white; }
    .card-sub { font-size: 0.8rem; color: #94a3b8; margin-top: 4px; }

    .charts-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
      margin-bottom: 32px;
    }
    .chart-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .chart-card h3 { margin: 0 0 16px; font-size: 1rem; color: #334155; }
    .allocation-chart { display: flex; flex-direction: column; align-items: center; }

    .progress-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .progress-section h3 { margin: 0 0 16px; font-size: 1rem; color: #334155; }
    .progress-bar-container {
      height: 12px;
      background: #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
    }
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #0ea5e9, #38bdf8);
      border-radius: 6px;
      transition: width 0.5s ease;
    }
    .progress-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 0.85rem;
      color: #64748b;
    }

    .recent-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      margin-top: 20px;
    }
    .recent-section h3 { margin: 0 0 16px; font-size: 1rem; color: #334155; }
    .recent-table { width: 100%; border-collapse: collapse; }
    .recent-table th {
      text-align: left;
      padding: 10px 16px;
      color: #64748b;
      font-weight: 600;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e2e8f0;
    }
    .recent-table td {
      padding: 10px 16px;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
      font-size: 0.9rem;
    }
    .recent-table .amount { font-variant-numeric: tabular-nums; font-weight: 500; }
    .recent-table .total { color: #0f172a; font-weight: 600; }

    @media (max-width: 768px) {
      .charts-grid { grid-template-columns: 1fr; }
      .dashboard { padding: 16px; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  @ViewChild('balanceChart') balanceChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('allocationChart') allocationChartRef!: ElementRef<HTMLCanvasElement>;

  account: Account | null = null;
  summary: ContributionSummary | null = null;
  balanceHistory: BalanceHistory[] = [];
  allocations: AssetAllocation[] = [];
  recentContributions: Contribution[] = [];
  loading = true;
  today = new Date();
  contributionPct = 0;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.api.getAccounts().subscribe(accounts => {
      if (accounts.length > 0) {
        this.account = accounts[0];
        this.loadAccountData(this.account.id);
      } else {
        this.loading = false;
      }
    });
  }

  private loadAccountData(accountId: string): void {
    let remaining = 4;
    const done = () => {
      remaining--;
      if (remaining === 0) {
        this.loading = false;
        if (this.summary && this.account) {
          this.contributionPct = Math.min(
            (this.summary.ytdEmployeeTotal / this.summary.irsLimit) * 100, 100
          );
        }
        this.cdr.detectChanges();
        this.renderCharts();
      }
    };

    this.api.getContributionSummary(accountId).subscribe({ next: s => { this.summary = s; done(); }, error: () => done() });
    this.api.getBalanceHistory(accountId).subscribe({ next: h => { this.balanceHistory = h; done(); }, error: () => done() });
    this.api.getAssetAllocation(accountId).subscribe({ next: a => { this.allocations = a; done(); }, error: () => done() });
    this.api.getContributions(accountId, 0, 5).subscribe({ next: p => { this.recentContributions = p.content; done(); }, error: () => done() });
  }

  private renderCharts(): void {
    if (this.balanceHistory.length > 0 && this.balanceChartRef) {
      new Chart(this.balanceChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: this.balanceHistory.map(h => h.recordDate),
          datasets: [{
            label: 'Balance',
            data: this.balanceHistory.map(h => h.balance),
            borderColor: '#0ea5e9',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: '#0ea5e9'
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
              ticks: { callback: (v) => '$' + Number(v).toLocaleString() }
            }
          }
        }
      });
    }

    if (this.allocations.length > 0 && this.allocationChartRef) {
      const colors = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981', '#6b7280'];
      const labels = this.allocations.map(a =>
        a.assetClass.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      );
      new Chart(this.allocationChartRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: this.allocations.map(a => a.percentage),
            backgroundColor: colors.slice(0, this.allocations.length),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.label}: ${ctx.raw}%`
              }
            }
          }
        }
      });
    }
  }
}
