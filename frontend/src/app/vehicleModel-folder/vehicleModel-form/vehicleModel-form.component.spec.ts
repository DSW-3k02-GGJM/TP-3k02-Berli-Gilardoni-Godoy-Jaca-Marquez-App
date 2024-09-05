import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleModelFormComponent } from '../vehicleModel-form/vehicleModel-form.component.js';

describe('VehicleModelFormComponent', () => {
  let component: VehicleModelFormComponent;
  let fixture: ComponentFixture<VehicleModelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleModelFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleModelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
