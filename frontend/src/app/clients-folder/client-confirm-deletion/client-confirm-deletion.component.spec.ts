import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientConfirmDeletionComponent } from './client-confirm-deletion.component';

describe('ClientConfirmDeletionComponent', () => {
  let component: ClientConfirmDeletionComponent;
  let fixture: ComponentFixture<ClientConfirmDeletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientConfirmDeletionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientConfirmDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
