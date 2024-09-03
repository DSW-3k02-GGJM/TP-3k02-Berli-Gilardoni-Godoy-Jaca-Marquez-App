import { TestBed } from '@angular/core/testing';

import { LocationCreatedOrModifiedService } from '../location-created-or-modified/location.service.js';

describe('LocationCreatedOrModifiedService', () => {
  let service: LocationCreatedOrModifiedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationCreatedOrModifiedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
