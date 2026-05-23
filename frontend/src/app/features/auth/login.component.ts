import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1>RetireWise</h1>
        <p class="subtitle">Sign in to your retirement dashboard</p>

        <div class="error" *ngIf="error">{{ error }}</div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" [(ngModel)]="email" name="email"
                   required placeholder="you@example.com">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" [(ngModel)]="password" name="password"
                   required placeholder="Enter your password">
          </div>
          <button type="submit" [disabled]="loading" class="btn-primary">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="switch-auth">
          Don't have an account? <a routerLink="/register">Create one</a>
        </p>

        <div class="demo-hint">
          <strong>Demo:</strong> demo&#64;example.com / password123
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    }
    .auth-card {
      background: white;
      padding: 48px;
      border-radius: 16px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
    }
    h1 {
      margin: 0 0 4px;
      font-size: 2rem;
      font-weight: 700;
      color: #0f172a;
    }
    .subtitle {
      color: #64748b;
      margin: 0 0 32px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      font-weight: 500;
      margin-bottom: 6px;
      color: #334155;
      font-size: 0.9rem;
    }
    input {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    input:focus {
      outline: none;
      border-color: #38bdf8;
      box-shadow: 0 0 0 3px rgba(56,189,248,0.15);
    }
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
      transition: background 0.2s;
    }
    .btn-primary:hover { background: #1e293b; }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
    .error {
      background: #fef2f2;
      color: #dc2626;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 0.9rem;
    }
    .switch-auth {
      text-align: center;
      margin-top: 24px;
      color: #64748b;
    }
    .switch-auth a { color: #0ea5e9; text-decoration: none; font-weight: 500; }
    .demo-hint {
      margin-top: 20px;
      padding: 12px;
      background: #f0f9ff;
      border-radius: 8px;
      font-size: 0.85rem;
      color: #0369a1;
      text-align: center;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Invalid credentials';
        this.loading = false;
      }
    });
  }
}
