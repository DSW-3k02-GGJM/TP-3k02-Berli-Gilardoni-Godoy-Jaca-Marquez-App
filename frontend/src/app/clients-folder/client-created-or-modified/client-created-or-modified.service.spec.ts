import { TestBed } from '@angular/core/testing';

import { ClientCreatedOrModifiedService } from './client-created-or-modified.service';

describe('ClientCreatedOrModifiedService', () => {
  let service: ClientCreatedOrModifiedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientCreatedOrModifiedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
