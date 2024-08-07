import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarcaFormComponent } from './marca-form.component';

describe('MarcaFormComponent', () => {
  let component: MarcaFormComponent;
  let fixture: ComponentFixture<MarcaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarcaFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MarcaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
