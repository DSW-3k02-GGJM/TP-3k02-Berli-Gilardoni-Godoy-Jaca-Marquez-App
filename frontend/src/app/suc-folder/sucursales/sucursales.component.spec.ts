import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalesComponent } from './sucursales.component';

describe('SucursalesComponent', () => {
  let component: SucursalesComponent;
  let fixture: ComponentFixture<SucursalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SucursalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SucursalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
