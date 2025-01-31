// Angular
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

// Components
import { VehicleFormComponent } from './vehicle-form.component';

// Testing
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('VehicleFormComponent', () => {
  let component: VehicleFormComponent;
  let fixture: ComponentFixture<VehicleFormComponent>;

  const formValues = {
    licensePlate: 'AAA123',
    manufacturingYear: 2020,
    totalKms: 10000,
    vehicleModel: 'Fiesta',
    color: 'Rojo',
    location: 'Centro',
  };

  const setFormValues = (values = formValues) => {
    component.vehicleForm.patchValue(values);
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleFormComponent, HttpClientModule],
      providers: [{ provide: ActivatedRoute, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleFormComponent);
    component = fixture.componentInstance;
  });

  describe('Form Creation', () => {
    it('should create an instance', () => {
      expect(component.vehicleForm).toBeTruthy();
    });
  });

  describe('Form Initialization', () => {
    it('should initialize with empty controls', () => {
      Object.keys(formValues).forEach((key) => {
        expect(component.vehicleForm.get(key)?.value).toEqual('');
      });
    });
  });

  describe('Form Validations', () => {
    describe('generic', () => {
      it('should be valid with correct data', () => {
        setFormValues();
        expect(component.vehicleForm.valid).toBeTrue();
      });
    });

    describe('licensePlate', () => {
      it('should be invalid if empty', () => {
        setFormValues({ ...formValues, licensePlate: '' });
        expect(component.vehicleForm.get('licensePlate')?.invalid).toBeTrue();
        expect(
          component.vehicleForm.get('licensePlate')?.errors?.['required']
        ).toBeTruthy();
      });

      it('should be invalid with wrong format', () => {
        setFormValues({ ...formValues, licensePlate: 'AA11111 RTY' });
        expect(component.vehicleForm.get('licensePlate')?.invalid).toBeTrue();
        expect(
          component.vehicleForm.get('licensePlate')?.errors?.[
            'invalidLicensePlate'
          ]
        ).toBeTruthy();
      });
    });

    describe('manufacturingYear', () => {
      it('should be valid with min value', () => {
        setFormValues({ ...formValues, manufacturingYear: 1900 });
        expect(
          component.vehicleForm.get('manufacturingYear')?.valid
        ).toBeTrue();
      });

      it('should be valid with max value (current year)', () => {
        setFormValues({
          ...formValues,
          manufacturingYear: new Date().getFullYear(),
        });
        expect(
          component.vehicleForm.get('manufacturingYear')?.valid
        ).toBeTrue();
      });

      it('should be invalid if less than min value', () => {
        setFormValues({ ...formValues, manufacturingYear: 1800 });
        expect(
          component.vehicleForm.get('manufacturingYear')?.invalid
        ).toBeTrue();
        expect(
          component.vehicleForm.get('manufacturingYear')?.errors?.['min']
        ).toBeTruthy();
      });

      it('should be invalid if greater than max value', () => {
        setFormValues({
          ...formValues,
          manufacturingYear: new Date().getFullYear() + 1,
        });
        expect(
          component.vehicleForm.get('manufacturingYear')?.invalid
        ).toBeTrue();
        expect(
          component.vehicleForm.get('manufacturingYear')?.errors?.['max']
        ).toBeTruthy();
      });

      it('should be invalid if not an integer', () => {
        setFormValues({ ...formValues, manufacturingYear: 2000.5 });
        expect(
          component.vehicleForm.get('manufacturingYear')?.invalid
        ).toBeTrue();
        expect(
          component.vehicleForm.get('manufacturingYear')?.errors?.['pattern']
        ).toBeTruthy();
      });
    });

    describe('totalKms', () => {
      it('should be valid with min value (0)', () => {
        setFormValues({ ...formValues, totalKms: 0 });
        expect(component.vehicleForm.get('totalKms')?.valid).toBeTrue();
      });

      it('should be invalid if negative', () => {
        setFormValues({ ...formValues, totalKms: -10000 });
        expect(component.vehicleForm.get('totalKms')?.invalid).toBeTrue();
        expect(
          component.vehicleForm.get('totalKms')?.errors?.['min']
        ).toBeTruthy();
      });

      it('should be invalid if not an integer', () => {
        setFormValues({ ...formValues, totalKms: 10000.5 });
        expect(component.vehicleForm.get('totalKms')?.invalid).toBeTrue();
        expect(
          component.vehicleForm.get('totalKms')?.errors?.['pattern']
        ).toBeTruthy();
      });
    });

    describe('vehicleModel', () => {
      it('should be invalid if empty', () => {
        setFormValues({ ...formValues, vehicleModel: '' });
        expect(component.vehicleForm.get('vehicleModel')?.invalid).toBeTrue();
        expect(
          component.vehicleForm.get('vehicleModel')?.errors?.['required']
        ).toBeTruthy();
      });
    });

    describe('color', () => {
      it('should be invalid if empty', () => {
        setFormValues({ ...formValues, color: '' });
        expect(component.vehicleForm.get('color')?.invalid).toBeTrue();
        expect(
          component.vehicleForm.get('color')?.errors?.['required']
        ).toBeTruthy();
      });
    });

    describe('location', () => {
      it('should be invalid if empty', () => {
        setFormValues({ ...formValues, location: '' });
        expect(component.vehicleForm.get('location')?.invalid).toBeTrue();
        expect(
          component.vehicleForm.get('location')?.errors?.['required']
        ).toBeTruthy();
      });
    });
  });
});
