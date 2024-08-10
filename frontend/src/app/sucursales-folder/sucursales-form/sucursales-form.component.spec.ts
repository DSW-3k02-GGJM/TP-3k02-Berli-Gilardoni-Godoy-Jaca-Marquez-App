import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalesFormComponent } from './sucursales-form.component';

describe('SucursalesFormComponent', () => {
  let component: SucursalesFormComponent;
  let fixture: ComponentFixture<SucursalesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SucursalesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SucursalesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
