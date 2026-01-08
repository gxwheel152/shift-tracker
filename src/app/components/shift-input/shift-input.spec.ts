import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftInputComponent } from './shift-input';

describe('ShiftInput', () => {
  let component: ShiftInputComponent;
  let fixture: ComponentFixture<ShiftInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftInputComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
