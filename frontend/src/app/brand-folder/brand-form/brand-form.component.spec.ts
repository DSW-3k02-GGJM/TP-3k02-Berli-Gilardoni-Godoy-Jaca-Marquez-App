import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandFormComponent } from '../brand-form/brand-form.component.js';

describe('MarcaFormComponent', () => {
  let component: BrandFormComponent;
  let fixture: ComponentFixture<BrandFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
