import { Component } from '@angular/core';
import { FormFloatingFieldComponent } from '../form-floating-textfield/form-floating-textfield.component.js';
import { FormFloatingSelectComponent } from '../form-floating-select/form-floating-select.component.js';
import { DatePickerComponent } from '../date-picker/date-picker.component.js';

@Component({
  selector: 'app-form-floating',
  standalone: true,
  imports: [
    FormFloatingFieldComponent,
    FormFloatingSelectComponent,
    DatePickerComponent,
  ],
  templateUrl: './form-floating.component.html',
  styleUrl: './form-floating.component.scss',
})
export class FormFloatingComponent {
  selectedDate = new Date();
}
