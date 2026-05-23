import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Account {
  id: string;
  accountName: string;
  currentBalance: number;
  employerMatchPct: number;
  createdAt: string;
}

export interface Contribution {
  id: string;
  contributionDate: string;
  employeeAmount: number;
  employerAmount: number;
  payPeriod: string;
}

export interface ContributionSummary {
  ytdEmployeeTotal: number;
  ytdEmployerTotal: number;
  ytdTotal: number;
  irsLimit: number;
  remainingAllowance: number;
}

export interface BalanceHistory {
  id: string;
  recordDate: string;
  balance: number;
}

export interface AssetAllocation {
  id: string;
  assetClass: string;
  percentage: number;
  asOfDate: string;
}

export interface CreateContributionRequest {
  contributionDate: string;
  employeeAmount: number;
  employerAmount: number;
  payPeriod: string;
}

export interface ProjectionRequest {
  currentAge: number;
  retirementAge: number;
  expectedReturnRate: number;
  annualContribution: number;
  currentBalance: number;
}

export interface ProjectionResponse {
  projectedBalance: number;
  estimatedMonthlyIncome: number;
  yearByYear: { age: number; balance: number }[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>('/api/accounts');
  }

  getAccount(id: string): Observable<Account> {
    return this.http.get<Account>(`/api/accounts/${id}`);
  }

  getContributions(accountId: string, page = 0, size = 20): Observable<PageResponse<Contribution>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Contribution>>(`/api/accounts/${accountId}/contributions`, { params });
  }

  createContribution(accountId: string, request: CreateContributionRequest): Observable<Contribution> {
    return this.http.post<Contribution>(`/api/accounts/${accountId}/contributions`, request);
  }

  getContributionSummary(accountId: string): Observable<ContributionSummary> {
    return this.http.get<ContributionSummary>(`/api/accounts/${accountId}/contributions/summary`);
  }

  getBalanceHistory(accountId: string): Observable<BalanceHistory[]> {
    return this.http.get<BalanceHistory[]>(`/api/accounts/${accountId}/balance-history`);
  }

  getAssetAllocation(accountId: string): Observable<AssetAllocation[]> {
    return this.http.get<AssetAllocation[]>(`/api/accounts/${accountId}/asset-allocation`);
  }

  calculateProjection(request: ProjectionRequest): Observable<ProjectionResponse> {
    return this.http.post<ProjectionResponse>('/api/projections/calculate', request);
  }
}
