import { ComponentFixture, TestBed } from '@angular/core/testing';
// Angular
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';


import { VehicleFormComponent } from './vehicle-form.component';

// Services
import { VehicleApiService } from '@core/vehicle/services/vehicle.api.service';
import { ColorApiService } from '@core/color/services/color.api.service';
import { LocationApiService } from '@core/location/services/location.api.service';
import { VehicleModelApiService } from '@core/vehicle-model/services/vehicle-model.api.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';
import { LicensePlateValidationService } from '@shared/services/validations/license-plate-validation.service';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

describe('VehicleFormComponent', () => {
  let component: VehicleFormComponent;
  let fixture: ComponentFixture<VehicleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        VehicleFormComponent,
        HttpClientModule, 
        CommonModule, 
        ReactiveFormsModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        PreventEnterDirective,
    ],
      providers: [
        VehicleApiService,
        ColorApiService,
        LocationApiService,
        VehicleModelApiService,
        OpenDialogService,
        SnackBarService,
        LicensePlateValidationService,
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: {} }
      ]
    })
    .compileComponents();
  });
  
  it('should create VehicleFormComponent', () => {
    fixture = TestBed.createComponent(VehicleFormComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty controls', () => {
    fixture = TestBed.createComponent(VehicleFormComponent);
    component = fixture.componentInstance;
    const form = component.vehicleForm;
    expect(form.controls['licensePlate'].value).toEqual('');
    expect(form.controls['manufacturingYear'].value).toEqual('');
    expect(form.controls['totalKms'].value).toEqual('');
    expect(form.controls['vehicleModel'].value).toEqual('');
    expect(form.controls['color'].value).toEqual('');
    expect(form.controls['location'].value).toEqual('');
  })

  it('should validate form with valid data', () => {
    fixture = TestBed.createComponent(VehicleFormComponent);
    component = fixture.componentInstance;
    const form = component.vehicleForm;
    form.controls['licensePlate'].setValue('ABC123');
    form.controls['manufacturingYear'].setValue(2020);
    form.controls['totalKms'].setValue(10000);
    form.controls['vehicleModel'].setValue('Fiesta');
    form.controls['color'].setValue('Rojo');
    form.controls['location'].setValue('Centro');
    expect(form.valid).toBeTrue();
    })

    it('should invalidate form with wrong licensePlate', () => {
        fixture = TestBed.createComponent(VehicleFormComponent);
        component = fixture.componentInstance;
        const form = component.vehicleForm;
        form.controls['licensePlate'].setValue('AA11111 RTY');
        form.controls['manufacturingYear'].setValue(2020);
        form.controls['totalKms'].setValue(10000);
        form.controls['vehicleModel'].setValue('Fiesta');
        form.controls['color'].setValue('Rojo');
        form.controls['location'].setValue('Centro');
        expect(form.valid).toBeFalse();
    })

    it('should invalidate form with wrong manufacturingYear', () => {
        fixture = TestBed.createComponent(VehicleFormComponent);
        component = fixture.componentInstance;
        const form = component.vehicleForm;
        form.controls['licensePlate'].setValue('AA11111 RTY');
        form.controls['manufacturingYear'].setValue(1800);
        form.controls['totalKms'].setValue(10000);
        form.controls['vehicleModel'].setValue('Fiesta');
        form.controls['color'].setValue('Rojo');
        form.controls['location'].setValue('Centro');
        expect(form.valid).toBeFalse();
    })

    it('should invalidate form with wrong totalKms', () => {
        fixture = TestBed.createComponent(VehicleFormComponent);
        component = fixture.componentInstance;
        const form = component.vehicleForm;
        form.controls['licensePlate'].setValue('AAA123');
        form.controls['manufacturingYear'].setValue(2020);
        form.controls['totalKms'].setValue(-10000);
        form.controls['vehicleModel'].setValue('Fiesta');
        form.controls['color'].setValue('Rojo');
        form.controls['location'].setValue('Centro');
        expect(form.valid).toBeFalse();
    })
    
    it('should invalidate form with wrong vehicleModel', () => {
        fixture = TestBed.createComponent(VehicleFormComponent);
        component = fixture.componentInstance;
        const form = component.vehicleForm;
        form.controls['licensePlate'].setValue('AAA123');
        form.controls['manufacturingYear'].setValue(2020);
        form.controls['totalKms'].setValue(10000);
        form.controls['vehicleModel'].setValue('');
        form.controls['color'].setValue('Rojo');
        form.controls['location'].setValue('Centro');
        expect(form.valid).toBeFalse();
    })

    it('should invalidate form with wrong color', () => {
        fixture = TestBed.createComponent(VehicleFormComponent);
        component = fixture.componentInstance;
        const form = component.vehicleForm;
        form.controls['licensePlate'].setValue('AAA123');
        form.controls['manufacturingYear'].setValue(2020);
        form.controls['totalKms'].setValue(10000);
        form.controls['vehicleModel'].setValue('Fiesta');
        form.controls['color'].setValue('');
        form.controls['location'].setValue('Centro');
        expect(form.valid).toBeFalse();
    })

    it('should invalidate form with wrong location', () => {
        fixture = TestBed.createComponent(VehicleFormComponent);
        component = fixture.componentInstance;
        const form = component.vehicleForm;
        form.controls['licensePlate'].setValue('AAA123');
        form.controls['manufacturingYear'].setValue(2020);
        form.controls['totalKms'].setValue(10000);
        form.controls['vehicleModel'].setValue('Fiesta');
        form.controls['color'].setValue('Rojo');
        form.controls['location'].setValue('');
        expect(form.valid).toBeFalse();
    })

});
