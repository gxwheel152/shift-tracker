import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { ShiftInputComponent } from './components/shift-input/shift-input';

@Component({
  selector: 'app-root',
  standalone: true,
  // imports: [RouterOutlet, ShiftInputComponent],
  imports: [ShiftInputComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  protected readonly title = signal('shift-tracker');
}
