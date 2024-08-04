import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFloatingFieldComponent } from './form-floating-textfield.component';

describe('FormFloatingFieldComponent', () => {
  let component: FormFloatingFieldComponent;
  let fixture: ComponentFixture<FormFloatingFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFloatingFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFloatingFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
