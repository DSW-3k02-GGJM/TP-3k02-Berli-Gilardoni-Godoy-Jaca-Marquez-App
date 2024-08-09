import { TestBed } from '@angular/core/testing';

import { CategoriaCreatedOrModifiedService } from './categoria-created-or-modified.service';

describe('CategoriaCreatedOrModifiedService', () => {
  let service: CategoriaCreatedOrModifiedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriaCreatedOrModifiedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
