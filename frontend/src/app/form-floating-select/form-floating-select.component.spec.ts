import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFloatingSelectComponent } from './form-floating-select.component';

describe('FormFloatingSelectComponent', () => {
  let component: FormFloatingSelectComponent;
  let fixture: ComponentFixture<FormFloatingSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFloatingSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormFloatingSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
