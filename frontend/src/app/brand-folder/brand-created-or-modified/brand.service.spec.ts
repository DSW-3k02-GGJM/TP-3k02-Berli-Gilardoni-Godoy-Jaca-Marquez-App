import { TestBed } from '@angular/core/testing';

import { BrandCreatedOrModifiedService } from './/brand.service.js';

describe('MarcaCreatedOrModifiedService', () => {
  let service: BrandCreatedOrModifiedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrandCreatedOrModifiedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
