import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { ConfirmDeletionComponent } from '../../shared/confirm-deletion/confirm-deletion.component';
import { FilterPipe } from '../../shared/filter/filter.pipe';
import { FormsModule } from '@angular/forms';
import {  Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../service/auth.service.js';
import { GenericErrorModalComponent } from '../../shared/generic-error-modal/generic-error-modal.component.js';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ConfirmDeletionComponent,
    FilterPipe,
    FormsModule,
    MatInputModule,
  ],
  templateUrl: './users-table.component.html',
  styleUrls: ['../../styles/genericSearchInput.scss', './users-table.component.scss'],
  providers: [AuthService],
})
export class UsersTableComponent {
  @Input() users!: any[];
  @Output() userDeleted = new EventEmitter();
  filterRows = '';

  constructor(
    private authService: AuthService,
    private modalService: NgbModal,
    private router: Router,
  ) {}

  formatBirthDate(birthDateDB: string): string {
    let birthDateTable: string = '${day}/${month}/${year}';
    birthDateTable = birthDateTable.replace(
      '${month}',
      birthDateDB.substring(5, 7)
    );
    birthDateTable = birthDateTable.replace(
      '${day}',
      birthDateDB.substring(8, 10)
    );
    birthDateTable = birthDateTable.replace(
      '${year}',
      birthDateDB.substring(0, 4)
    );
    return birthDateTable;
  }

  editUser(user: any): void {
    this.router.navigate(['/staff/users/' + user.id]);
  }

  deleteUser(user: any): void {
    const modalRef = this.modalService.open(ConfirmDeletionComponent);
    modalRef.componentInstance.title = 'Eliminar usuario';
    modalRef.componentInstance.message = `¿Está seguro de que desea eliminar al usuario ${user.userSurname}, ${user.userName}?`;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.authService
            .deleteUser(Number(user.id))
            .subscribe({
              next: (response) => {
                this.userDeleted.emit(user.id);
              },
              error: (error) => {
                if (error.status === 400) { 
                  const modalRef = this.modalService.open(GenericErrorModalComponent);
                  modalRef.componentInstance.title = 'Error al eliminar el usuario';
                  modalRef.componentInstance.message = 'El usuario no se puede eliminar porque tiene reservas asociadas.';
                }
              }
            });
        }
      },
      () => {}
    );
  }
}
