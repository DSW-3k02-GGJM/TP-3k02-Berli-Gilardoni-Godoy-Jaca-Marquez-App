import { TestBed } from '@angular/core/testing';

import { SucursalCreatedOrModifiedService } from './suc.service';

describe('SucursalCreatedOrModifiedService', () => {
  let service: SucursalCreatedOrModifiedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SucursalCreatedOrModifiedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
