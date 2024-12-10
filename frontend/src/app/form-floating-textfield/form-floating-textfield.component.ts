import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-floating-textfield',
  standalone: true,
  imports: [],
  templateUrl: './form-floating-textfield.component.html',
  styleUrl: './form-floating-textfield.component.scss',
})
export class FormFloatingFieldComponent {
  @Input() type!: string;
  @Input() idfor!: string;
  @Input() placeholder!: string;
  @Input() labelText!: string;
}
