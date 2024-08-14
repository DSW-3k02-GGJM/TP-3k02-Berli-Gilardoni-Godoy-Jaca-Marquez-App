import { TestBed } from '@angular/core/testing';

import { MarcaCreatedOrModifiedService } from './mar.service';

describe('MarcaCreatedOrModifiedService', () => {
  let service: MarcaCreatedOrModifiedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarcaCreatedOrModifiedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
