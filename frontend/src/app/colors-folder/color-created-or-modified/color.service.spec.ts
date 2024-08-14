import { TestBed } from '@angular/core/testing';

import { ColorCreatedOrModifiedService } from './color.service';

describe('ColorCreatedOrModifiedService', () => {
  let service: ColorCreatedOrModifiedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorCreatedOrModifiedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
