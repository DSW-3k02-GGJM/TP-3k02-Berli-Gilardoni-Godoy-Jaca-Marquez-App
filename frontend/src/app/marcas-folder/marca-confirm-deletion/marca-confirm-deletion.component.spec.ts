import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcaConfirmDeletionComponent } from './marca-confirm-deletion.component';

describe('MarcaConfirmDeletionComponent', () => {
  let component: MarcaConfirmDeletionComponent;
  let fixture: ComponentFixture<MarcaConfirmDeletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarcaConfirmDeletionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarcaConfirmDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
