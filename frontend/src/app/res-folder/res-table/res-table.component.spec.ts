import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResTableComponent } from './res-table.component';

describe('ResTableComponent', () => {
  let component: ResTableComponent;
  let fixture: ComponentFixture<ResTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
