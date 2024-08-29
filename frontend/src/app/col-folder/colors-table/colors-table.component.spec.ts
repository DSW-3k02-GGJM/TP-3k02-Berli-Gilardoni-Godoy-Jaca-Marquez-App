import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorsTableComponent } from './colors-table.component';

describe('ColorsTableComponent', () => {
  let component: ColorsTableComponent;
  let fixture: ComponentFixture<ColorsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
