import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResComponent } from './rescli.component';

describe('RentsComponent', () => {
  let component: ResComponent;
  let fixture: ComponentFixture<ResComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});