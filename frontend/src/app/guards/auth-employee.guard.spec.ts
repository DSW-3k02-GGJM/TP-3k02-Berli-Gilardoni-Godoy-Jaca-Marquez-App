import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authEmployeeGuard } from './auth-employee.guard';

describe('authEmployeeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authEmployeeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
