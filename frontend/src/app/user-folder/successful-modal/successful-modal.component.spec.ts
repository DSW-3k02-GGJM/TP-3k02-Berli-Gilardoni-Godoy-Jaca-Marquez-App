import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfulModalComponent } from './successful-modal.component';

describe('SuccessfulModalComponent', () => {
  let component: SuccessfulModalComponent;
  let fixture: ComponentFixture<SuccessfulModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessfulModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessfulModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
