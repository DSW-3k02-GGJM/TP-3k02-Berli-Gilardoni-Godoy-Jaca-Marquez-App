import { TestBed } from '@angular/core/testing';

import { DateFilterService } from './date-filter.service';

describe('DateFilterService', () => {
  let service: DateFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
