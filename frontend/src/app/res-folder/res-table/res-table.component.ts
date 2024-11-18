import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { FilterPipe } from '../../shared/filter/filter.pipe';
import { FormsModule } from '@angular/forms';
import { ResCreatedOrModifiedService } from '../res-created-or-modified/res.service.js';
import { Router } from '@angular/router';
import { differenceInDays } from 'date-fns';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeletionDialogComponent } from '../../shared/confirm-deletion-dialog/confirm-deletion-dialog.component.js';

@Component({
  selector: 'app-res-table',
  standalone: true,
  templateUrl: './res-table.component.html',
  styleUrl: './res-table.component.scss',
  imports: [
    CommonModule,
    HttpClientModule,
    FilterPipe,
    FormsModule,
    MatInputModule,
  ],
  providers: [ApiService],
})
export class ResTableComponent {
  readonly dialog = inject(MatDialog);


  openConfirmDialog(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data:{
        title: 'Eliminar reserva',
        message: '¿Está seguro de que desea eliminar la reserva?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService
            .delete('reservations', Number(id))
            .subscribe((response) => {
              this.resDeleted.emit(id);
            });
      }
    });
  }

  openCheckInDialog(res: any): void {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data:{
        title: 'Check-in Reserva',
        message: '¿Está seguro de que desea realizar el check-in de la reserva?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const data = {
          // Se envían los cuatro primeros atributos porque son requeridos en el sanitizedInput del backend
          startDate: res.startDate,
          plannedEndDate: res.plannedEndDate,
          user: res.user.id,
          vehicle: res.vehicle.id,
          //
          initialKms: res.vehicle.totalKms,
        };

        this.apiService
          .update('reservations', Number(res.id), data)
          .subscribe((response) => {
            this.resCreatedOrModifiedService.notifyResCreatedOrModified();
          });
      }
    });
  }

  openCheckOutDialog(res: any): void {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data:{
        title: 'Check-out Reserva',
        message: '¿Está seguro de que desea realizar el check-out de la reserva?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const data = {
          // Se envían los cuatro primeros atributos porque son requeridos en el sanitizedInput del backend
          startDate: res.startDate,
          plannedEndDate: res.plannedEndDate,
          user: res.user.id,
          vehicle: res.vehicle.id,
          //
          realEndDate: new Date().toISOString().split('T')[0],
          finalKm: res.vehicle.totalKms,
        };

        this.apiService
          .update('reservations', Number(res.id), data)
          .subscribe((response) => {
            this.resCreatedOrModifiedService.notifyResCreatedOrModified();
          });
      }
    });
  }
  @Input() reservations!: any[];
  @Output() resDeleted = new EventEmitter();
  filterRows = '';

  constructor(
    private apiService: ApiService,
    private resCreatedOrModifiedService: ResCreatedOrModifiedService,
    private router: Router
  ) {}

  formatDate(DateDB: string): string {
    let DateTable: string = '${day}/${month}/${year}';
    DateTable = DateTable.replace('${month}', DateDB.substring(5, 7));
    DateTable = DateTable.replace('${day}', DateDB.substring(8, 10));
    DateTable = DateTable.replace('${year}', DateDB.substring(0, 4));
    return DateTable;
  }

  editRes(res: any): void {
    this.router.navigate(['/staff/reservations/' + res.id]);
  }

  deleteRes(res: any): void {
    this.openConfirmDialog(res.id);
  }

  checkInRes(res: any): void {
    this.openCheckInDialog(res);
  }

  checkOutRes(res: any): void {
    this.openCheckOutDialog(res);
  }

  calculatePrice(res: any): string {
    const startDate = new Date(res.startDate);
    const plannedEndDate = new Date(res.plannedEndDate);
    const realEndDate = new Date(res.realEndDate);
    const pricePerDay = res.vehicle.vehicleModel.category.pricePerDay;

    // Determinar cuál de las dos fechas es mayor
    // Si el cliente devuelve el auto antes se le cobra según la fecha de fin planeada de la reserva
    // Si lo devuelve después de la fecha planeada, se le cobra según la fecha fin real (fecha al momento de la devolucion)
    const endDate = plannedEndDate > realEndDate ? plannedEndDate : realEndDate;

    // Calcular la diferencia en días y el precio
    const days = differenceInDays(endDate, startDate);
    return `${days * pricePerDay}`;
  }
}
