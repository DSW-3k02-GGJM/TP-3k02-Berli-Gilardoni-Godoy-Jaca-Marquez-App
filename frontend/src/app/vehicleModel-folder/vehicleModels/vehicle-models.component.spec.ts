import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleModelsComponent } from '../vehicleModels/vehicle-models.component.js';

describe('VehicleModelComponent', () => {
  let component: VehicleModelsComponent;
  let fixture: ComponentFixture<VehicleModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleModelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
