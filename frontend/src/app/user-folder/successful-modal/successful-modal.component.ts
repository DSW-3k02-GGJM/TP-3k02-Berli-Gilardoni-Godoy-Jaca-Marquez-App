import {Component, Input} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";

@Component({
  selector: 'app-successful-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './successful-modal.component.html',
  styleUrl: './successful-modal.component.scss',
})
export class SuccessfulModalComponent {
  @Input() title: string = '';

  constructor(
    public activeModal: NgbActiveModal,
    public router: Router
  ) {}
}
