import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-generic-error-modal',
  standalone: true,
  imports: [],
  templateUrl: './generic-error-modal.component.html',
  styleUrl: './generic-error-modal.component.scss'
})
export class GenericErrorModalComponent {
  @Input() title: string = '';
  @Input() message: string = '';

  constructor(public activeModal: NgbActiveModal) {}
}
