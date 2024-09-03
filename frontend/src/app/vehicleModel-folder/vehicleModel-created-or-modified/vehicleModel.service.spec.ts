import { TestBed } from '@angular/core/testing';

import { VehicleModelCreatedOrModifiedService } from './vehicleModel.service.js';

describe('VehicleModelCreatedOrModifiedService', () => {
  let service: VehicleModelCreatedOrModifiedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleModelCreatedOrModifiedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
