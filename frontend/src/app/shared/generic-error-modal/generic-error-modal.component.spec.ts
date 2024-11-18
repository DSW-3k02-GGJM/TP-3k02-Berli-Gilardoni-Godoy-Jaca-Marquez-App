import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericErrorModalComponent } from './generic-error-modal.component';

describe('GenericErrorModalComponent', () => {
  let component: GenericErrorModalComponent;
  let fixture: ComponentFixture<GenericErrorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericErrorModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
