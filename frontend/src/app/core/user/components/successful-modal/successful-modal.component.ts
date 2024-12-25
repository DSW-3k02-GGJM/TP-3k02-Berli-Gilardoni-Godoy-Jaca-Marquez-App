// Angular
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Router module for navigation
import { Router } from '@angular/router';

@Component({
  selector: 'app-successful-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './successful-modal.component.html',
})
export class SuccessfulModalComponent {
  @Input() title: string = '';

  constructor(public activeModal: NgbActiveModal, public router: Router) {}
}
