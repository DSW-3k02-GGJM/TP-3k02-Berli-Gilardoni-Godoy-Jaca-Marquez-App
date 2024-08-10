import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelosTableComponent } from './modelos-table.component';

describe('ModelosTableComponent', () => {
  let component: ModelosTableComponent;
  let fixture: ComponentFixture<ModelosTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelosTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
