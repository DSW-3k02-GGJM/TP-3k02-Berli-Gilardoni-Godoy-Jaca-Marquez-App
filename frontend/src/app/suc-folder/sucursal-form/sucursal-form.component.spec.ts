import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalFormComponent } from './sucursal-form.component';

describe('SucursalFormComponent', () => {
  let component: SucursalFormComponent;
  let fixture: ComponentFixture<SucursalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SucursalFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SucursalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
