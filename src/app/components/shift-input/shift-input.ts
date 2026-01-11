import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShiftService } from '../../services/shift.service';
import { Shift, CalculationResult } from '../../models/shift.models';

@Component({
  selector: 'app-shift-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shift-input.html',
  styleUrls: ['./shift-input.scss'],
})
export class ShiftInputComponent {
  shifts: Shift[] = [{ start: '06:30', end: '16:00', breakMinutes: 30 }];
  result?: CalculationResult;
  apiError?: string;
  shiftGridGap: string = '33px';

  constructor(private shiftService: ShiftService, private cd: ChangeDetectorRef) {}

  addShift() {
    this.shifts.push({ start: '06:30', end: '16:00', breakMinutes: 30 });
    // this.calculateSingleShift(this.shifts.length - 1);
  }

  removeShift(i: number) {
    this.shifts.splice(i, 1);
  }

  // onShiftChange(i: number) {
  //   this.calculateSingleShift(i);
  // }

  onModelChange(i: number) {
    const s = this.shifts[i];
    if (!s) return;
    s.breakMinutes = Number(s.breakMinutes ?? 0);
  }

  async pingApi() {
    this.shiftService.health().subscribe({
      next: (res) => {
        this.apiError = undefined;
        console.log(res);
      },
      error: (err) => {
        this.apiError = 'API not reachable';
        console.error(err);
      },
    });
  }

  calculate() {
    this.apiError = undefined;
    // console.log('Calculating weekly minutes for ALL Shifts:', this.shifts);

    const payload = this.shifts.map((s) => ({
      ...s,
      breakMinutes: Number(s.breakMinutes ?? 0),
    }));

    this.shiftService.calculateWeeklyMinutes(payload).subscribe({
      next: (res) => {
        this.result = res;
        this.cd.detectChanges();
        this.apiError = undefined;
      },
      error: (err) => {
        this.apiError = 'Failed to calculate';
        console.error(err);
      },
    });
  }

  // calculateSingleShift(i: number) {
  //   const shift = this.shifts[i];
  //   console.log(`Calculating shift: ${JSON.stringify(shift)}`);
  //   this.shiftService.calculateShiftMinutes(shift).subscribe({
  //     next: (res) => {
  //       this.result = res;
  //       this.apiError = undefined;
  //     },
  //     error: (err) => {
  //       this.apiError = 'Failed to calculate shift minutes';
  //       console.error(err);
  //     },
  //   });
  // }
}
