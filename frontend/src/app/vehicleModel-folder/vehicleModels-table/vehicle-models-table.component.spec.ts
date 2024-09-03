import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleModelsTableComponent } from '../vehicleModels-table/vehicle-models-table.component.js';

describe('VehicleModelTableComponent', () => {
  let component: VehicleModelsTableComponent;
  let fixture: ComponentFixture<VehicleModelsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleModelsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleModelsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
