import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMatiComponent } from './test-mati.component';

describe('TestMatiComponent', () => {
  let component: TestMatiComponent;
  let fixture: ComponentFixture<TestMatiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestMatiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestMatiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
