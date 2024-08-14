import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcasTableComponent } from './marcas-table.component';

describe('MarcasTableComponent', () => {
  let component: MarcasTableComponent;
  let fixture: ComponentFixture<MarcasTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarcasTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarcasTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
