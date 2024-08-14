import { TestBed } from '@angular/core/testing';

import { CreatedOrModifiedService } from './created-or-modified.service';

describe('CreatedOrModifiedService', () => {
  let service: CreatedOrModifiedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatedOrModifiedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
