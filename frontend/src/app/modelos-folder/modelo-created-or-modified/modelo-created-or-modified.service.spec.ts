import { TestBed } from '@angular/core/testing';

import { ModeloCreatedOrModifiedService } from './modelo-created-or-modified.service';

describe('ModeloCreatedOrModifiedService', () => {
  let service: ModeloCreatedOrModifiedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModeloCreatedOrModifiedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
