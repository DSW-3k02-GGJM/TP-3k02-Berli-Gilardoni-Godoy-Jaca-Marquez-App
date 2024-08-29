import { TestBed } from '@angular/core/testing';

import { VehicleCreatedOrModifiedService } from './vehicle.service';

describe('VehicleCreatedOrModifiedService', () => {
  let service: VehicleCreatedOrModifiedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleCreatedOrModifiedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
