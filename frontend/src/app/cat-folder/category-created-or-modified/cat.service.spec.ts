import { TestBed } from '@angular/core/testing';

import { CategoryCreatedOrModifiedService } from './cat.service.js';

describe('CategoryCreatedOrModifiedService', () => {
  let service: CategoryCreatedOrModifiedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryCreatedOrModifiedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
