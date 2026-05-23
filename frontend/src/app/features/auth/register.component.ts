import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1>Create Account</h1>
        <p class="subtitle">Start tracking your retirement</p>

        <div class="error" *ngIf="error">{{ error }}</div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="fullName">Full Name</label>
            <input type="text" id="fullName" [(ngModel)]="fullName" name="fullName" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" [(ngModel)]="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" [(ngModel)]="password" name="password"
                   required minlength="8" placeholder="Min. 8 characters">
          </div>
          <button type="submit" [disabled]="loading" class="btn-primary">
            {{ loading ? 'Creating...' : 'Create Account' }}
          </button>
        </form>

        <p class="switch-auth">
          Already have an account? <a routerLink="/auth">Sign in</a>
        </p>
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
    h1 { margin: 0 0 4px; font-size: 2rem; font-weight: 700; color: #0f172a; }
    .subtitle { color: #64748b; margin: 0 0 32px; }
    .form-group { margin-bottom: 20px; }
    label { display: block; font-weight: 500; margin-bottom: 6px; color: #334155; font-size: 0.9rem; }
    input {
      width: 100%; padding: 10px 14px; border: 1px solid #e2e8f0;
      border-radius: 8px; font-size: 1rem; box-sizing: border-box;
    }
    input:focus { outline: none; border-color: #38bdf8; box-shadow: 0 0 0 3px rgba(56,189,248,0.15); }
    .btn-primary {
      width: 100%; padding: 12px; background: #0f172a; color: white;
      border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer;
    }
    .btn-primary:hover { background: #1e293b; }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
    .error { background: #fef2f2; color: #dc2626; padding: 12px; border-radius: 8px; margin-bottom: 20px; }
    .switch-auth { text-align: center; margin-top: 24px; color: #64748b; }
    .switch-auth a { color: #0ea5e9; text-decoration: none; font-weight: 500; }
  `]
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    this.auth.register(this.email, this.password, this.fullName).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error = err.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}
