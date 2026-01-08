export interface Shift {
  start: string;
  end: string;
  breakMinutes?: number;
}

export interface ShiftWithDetails {
  start: string;
  end: string;
  breakMinutes?: number;
  minutes: number;
  hours: number;
  mins: number;
}

export interface CalculationResult {
  shifts: ShiftWithDetails[];
  totals: { totalMinutes: number; hours: number; minutes: number };
  summary: string;
  errors?: string[];
}
