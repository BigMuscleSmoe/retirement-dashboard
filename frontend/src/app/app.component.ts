import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <nav class="sidebar" *ngIf="auth.isLoggedIn()">
        <div class="logo">
          <h2>RetireWise</h2>
        </div>
        <ul class="nav-links">
          <li>
            <a routerLink="/dashboard" routerLinkActive="active">
              <span class="icon">&#9632;</span> Dashboard
            </a>
          </li>
          <li>
            <a routerLink="/contributions" routerLinkActive="active">
              <span class="icon">&#9654;</span> Contributions
            </a>
          </li>
          <li>
            <a routerLink="/projections" routerLinkActive="active">
              <span class="icon">&#9650;</span> Projections
            </a>
          </li>
        </ul>
        <div class="user-section">
          <div class="user-info">
            <span class="user-name">{{ auth.getUser()?.fullName }}</span>
            <span class="user-email">{{ auth.getUser()?.email }}</span>
          </div>
          <button class="logout-btn" (click)="auth.logout()">Sign Out</button>
        </div>
      </nav>
      <main [class.full-width]="!auth.isLoggedIn()">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; }
    .app-container { display: flex; height: 100%; }
    .sidebar {
      width: 260px;
      background: #0f172a;
      color: white;
      display: flex;
      flex-direction: column;
      padding: 0;
      flex-shrink: 0;
    }
    .logo {
      padding: 24px 24px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .logo h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #38bdf8;
    }
    .nav-links {
      list-style: none;
      padding: 16px 0;
      margin: 0;
      flex: 1;
    }
    .nav-links li a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 24px;
      color: #94a3b8;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;
    }
    .nav-links li a:hover { color: white; background: rgba(255,255,255,0.05); }
    .nav-links li a.active {
      color: #38bdf8;
      background: rgba(56,189,248,0.1);
      border-right: 3px solid #38bdf8;
    }
    .icon { font-size: 0.8rem; }
    .user-section {
      padding: 16px 24px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    .user-info {
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
    }
    .user-name { font-weight: 600; font-size: 0.9rem; }
    .user-email { font-size: 0.75rem; color: #64748b; }
    .logout-btn {
      width: 100%;
      padding: 8px;
      background: transparent;
      border: 1px solid #334155;
      color: #94a3b8;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
    }
    .logout-btn:hover { background: #1e293b; color: white; }
    main {
      flex: 1;
      overflow-y: auto;
      background: #f8fafc;
    }
    main.full-width { width: 100%; }
  `]
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}
