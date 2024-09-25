import { TestBed } from '@angular/core/testing';
import { ResCreatedOrModifiedService } from './rescli.service';

describe('ResService', () => {
  let service: ResCreatedOrModifiedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResCreatedOrModifiedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});