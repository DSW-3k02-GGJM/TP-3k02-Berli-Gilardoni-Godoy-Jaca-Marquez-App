import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResTableComponent } from '../res-table/res-table.component.js';
import { ResFormComponent } from '../res-form/res-form.component.js';
import { HttpClientModule } from '@angular/common/http';
import { ResCreatedOrModifiedService } from '../res-created-or-modified/res.service.js';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-res',
  standalone: true,
  imports: [CommonModule, ResTableComponent, ResFormComponent],
  templateUrl: './res.component.html',
  styleUrl: './res.component.scss'
})
export class ResComponent implements OnInit {
  reservations: any[] = [];
  private subscription?: Subscription;

  constructor(
    private apiService: ApiService,
    private resCreatedOrModifiedService: ResCreatedOrModifiedService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fillData();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onResDeleted(resId: number): void {
    this.reservations = this.reservations.filter((res) => res.id !== resId);
  }

  fillData() {
    this.subscription =
      this.resCreatedOrModifiedService.resCreatedOrModified.subscribe(
        () => {
          this.loadData();
        }
      );

    if (!this.resCreatedOrModifiedService.isDataLoaded) {
      this.loadData();
    }
  }

  loadData() {
    this.apiService.getAll('reservations').subscribe((response) => {
      this.reservations = response.data;
    });
  }

  newReservation() {
    const modalRef = this.modalService.open(ResFormComponent, {
      size: 'l',
      centered: true,
    });
    modalRef.componentInstance.title = 'Nueva Reserva';
  }
}
