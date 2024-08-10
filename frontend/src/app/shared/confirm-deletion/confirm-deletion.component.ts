import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-deletion',
  standalone: true,
  imports: [],
  templateUrl: './confirm-deletion.component.html',
  styleUrl: './confirm-deletion.component.scss',
})
export class ConfirmDeletionComponent {
  @Input() title: string = '';
  @Input() message: string = '';

  constructor(public activeModal: NgbActiveModal) {}
}
