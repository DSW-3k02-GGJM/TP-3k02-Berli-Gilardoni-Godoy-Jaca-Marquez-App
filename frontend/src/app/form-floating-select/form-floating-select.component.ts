import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-floating-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-floating-select.component.html',
  styleUrl: './form-floating-select.component.scss',
})
export class FormFloatingSelectComponent {
  @Input() selectText!: string;
  @Input() options!: string[];
}
