import { TestBed } from '@angular/core/testing';

import { SharedServiceTsService } from './shared.service.ts.service';

describe('SharedServiceTsService', () => {
  let service: SharedServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
