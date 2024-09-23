import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authClientGuard } from './auth-client.guard';

describe('authClientGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authClientGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
