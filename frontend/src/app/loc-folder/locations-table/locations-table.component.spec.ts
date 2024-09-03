import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationsTableComponent } from '../locations-table/locations-table.component.js';

describe('SucursalesTableComponent', () => {
  let component: LocationsTableComponent;
  let fixture: ComponentFixture<LocationsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
