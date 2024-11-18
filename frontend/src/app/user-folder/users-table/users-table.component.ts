import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { FilterPipe } from '../../shared/filter/filter.pipe';
import { FormsModule } from '@angular/forms';
import {  Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../service/auth.service.js';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeletionDialogComponent } from '../../shared/confirm-deletion-dialog/confirm-deletion-dialog.component.js';
import { GenericErrorDialogComponent } from '../../shared/generic-error-dialog/generic-error-dialog.component.js';
@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FilterPipe,
    FormsModule,
    MatInputModule,
  ],
  templateUrl: './users-table.component.html',
  styleUrls: ['../../styles/genericSearchInput.scss', './users-table.component.scss'],
  providers: [AuthService],
})
export class UsersTableComponent {
  readonly dialog = inject(MatDialog);

  openErrorDialog(): void {
    this.dialog.open(GenericErrorDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data:{
        title: 'Error al eliminar al usuario',
        message: 'El usuario no se puede eliminar porque tiene reservas asociadas.',
        haveRouterLink: false,
      }
    });
  }

  openConfirmDialog(name: string, surname: string, id: number): void {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data:{
        title: 'Eliminar usuario',
        message: `¿Está seguro de que desea eliminar al usuario ${surname}, ${name}?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService
            .deleteUser(Number(id))
            .subscribe({
              next: (response) => {
                this.userDeleted.emit(id);
              },
              error: (error) => {
                if (error.status === 400) { 
                  this.openErrorDialog();
                }
              }
            });
      }
    });
  }
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
    this.openConfirmDialog(user.userName, user.userSurname, user.id);
  }
}
