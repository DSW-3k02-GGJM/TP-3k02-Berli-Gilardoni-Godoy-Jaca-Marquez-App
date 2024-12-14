import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  SimpleChanges,
} from '@angular/core';
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
  styleUrl: '../../styles/genericTable.scss',
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
      data: {
        title: 'Eliminar reserva',
        titleColor: 'danger',
        image: 'assets/delete.png',
        message: '¿Está seguro de que desea eliminar la reserva?',
        buttonColor: 'danger',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService
          .delete('reservations', Number(id))
          .subscribe((response) => {
            this.resDeleted.emit(id);
          });
      }
    });
  }

  openCancelDialog(res: any){
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Cancelar Reserva',
        titleColor: 'black',
        image: 'assets/wrongmark.png',
        message:
          '¿Está seguro de que desea cancelar la reserva?',
        buttonColor: 'primary',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = {
          // Se envían los cuatro primeros atributos porque son requeridos en el sanitizedInput del backend
          startDate: res.startDate,
          plannedEndDate: res.plannedEndDate,
          user: res.user.id,
          vehicle: res.vehicle.id,
          //
          cancellationDate: new Date(),
        };

        this.apiService
          .update('reservations', Number(res.id), data)
          .subscribe((response) => {
            this.resCreatedOrModifiedService.notifyResCreatedOrModified();
          });
      }
    });
  }

  openCheckInDialog(res: any): void {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Check-in Reserva',
        titleColor: 'black',
        image: 'assets/check-in-img.png',
        message:
          '¿Está seguro de que desea realizar el check-in de la reserva?',
        buttonColor: 'primary',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
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
      data: {
        title: 'Check-out Reserva',
        titleColor: 'black',
        image: 'assets/check-out-img.png',
        message:
          '¿Está seguro de que desea realizar el check-out de la reserva?',
        buttonColor: 'primary',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = {
          // Se envían los cuatro primeros atributos porque son requeridos en el sanitizedInput del backend
          startDate: res.startDate,
          plannedEndDate: res.plannedEndDate,
          user: res.user.id,
          vehicle: res.vehicle.id,
          //
          realEndDate: new Date(),
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

  filterDate: string = '';

  filteredReservations: any[] = [];

  constructor(
    private apiService: ApiService,
    private resCreatedOrModifiedService: ResCreatedOrModifiedService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Comprueba si el valor de 'reservations' ha cambiado
    if (changes['reservations'] && !changes['reservations'].firstChange) {
      this.filterReservations();
    }
  }

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

  cancelRes(res: any){
    this.openCancelDialog(res);
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

  filterReservations(): void {
    // Verificar si la fecha está vacía
    const date = this.filterDate ? new Date(this.filterDate) : null;

    // Si no se proporciona la fecha, devolver todas las reservas
    if (!this.filterDate) {
      this.filteredReservations = this.reservations;
    } else if (!date || isNaN(date.getTime())) {
      // Si la fecha es inválida, devolver todas las reservas
      this.filteredReservations = this.reservations;
    } else {
      // Si la fecha es válida, filtrar las reservas
      this.filteredReservations = this.reservations.filter((reservation) => {
        const startDate = new Date(reservation.startDate);
        const plannedEndDate = new Date(reservation.plannedEndDate);

        // Comprobar si la fecha está dentro del rango de startDate y plannedEndDate
        return date >= startDate && date <= plannedEndDate;
      });
    }
  }
}
