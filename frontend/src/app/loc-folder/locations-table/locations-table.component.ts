import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeletionComponent } from '../../shared/confirm-deletion/confirm-deletion.component';
import { FilterPipe } from '../../shared/filter/filter.pipe';
import { FormsModule } from '@angular/forms';
import { LocationFormComponent } from '../location-form/location-form.component.js';

@Component({
  selector: 'app-locations-table',
  standalone: true,
  templateUrl: './locations-table.component.html',
  styleUrl: './locations-table.component.scss',
  imports: [
    CommonModule,
    HttpClientModule,
    ConfirmDeletionComponent,
    FilterPipe,
    FormsModule,
  ],
  providers: [ApiService],
})
export class LocationsTableComponent {
  @Input() locations!: any[];
  @Output() locationDeleted = new EventEmitter();
  filterRows = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private modalService: NgbModal,
  ) {}

  editLocation(location: any): void {
    this.router.navigate(['/admin/locations/' + location.id]);
  }

  deleteLocation(location: any): void {
    const modalRef = this.modalService.open(ConfirmDeletionComponent);
    modalRef.componentInstance.title = 'Eliminar sucursal';
    modalRef.componentInstance.message = `¿Está seguro de que desea eliminar la sucursal ${location.locationName}?`;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.apiService
            .delete('locations', Number(location.id))
            .subscribe((response) => {
              this.locationDeleted.emit(location.id);
            });
        }
      },
      () => {}
    );
  }
}
