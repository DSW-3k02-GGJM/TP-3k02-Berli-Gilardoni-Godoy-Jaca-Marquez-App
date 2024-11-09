import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResStepperComponent } from './res-stepper.component';

describe('ResStepperComponent', () => {
  let component: ResStepperComponent;
  let fixture: ComponentFixture<ResStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResStepperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
