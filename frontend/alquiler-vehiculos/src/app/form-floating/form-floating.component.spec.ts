import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFloatingComponent } from './form-floating.component';

describe('FormFloatingComponent', () => {
  let component: FormFloatingComponent;
  let fixture: ComponentFixture<FormFloatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFloatingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormFloatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
