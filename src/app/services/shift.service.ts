import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Shift, CalculationResult } from '../models/shift.models';

@Injectable({ providedIn: 'root' })
export class ShiftService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  calculateWeeklyMinutes(shifts: Shift[]): Observable<CalculationResult> {
    return this.http.post<CalculationResult>(`${this.baseUrl}/calculate-time`, { shifts });
  }

  calculateShiftMinutes(shift: Shift): Observable<CalculationResult> {
    return this.http.post<CalculationResult>(`${this.baseUrl}/calculate-time`, { shifts: [shift] });
  }

  health(): Observable<any> {
    return this.http.get(`${this.baseUrl}/health`);
  }
}
