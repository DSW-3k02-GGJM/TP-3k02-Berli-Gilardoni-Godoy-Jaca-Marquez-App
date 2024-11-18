import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestComponenteComponent } from './test-componente.component';

describe('TestComponenteComponent', () => {
  let component: TestComponenteComponent;
  let fixture: ComponentFixture<TestComponenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestComponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
