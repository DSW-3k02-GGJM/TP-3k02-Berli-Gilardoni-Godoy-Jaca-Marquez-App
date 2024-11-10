import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericSuccesDialogComponent } from './generic-succes-dialog.component';

describe('GenericSuccesDialogComponent', () => {
  let component: GenericSuccesDialogComponent;
  let fixture: ComponentFixture<GenericSuccesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericSuccesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericSuccesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
