// Angular
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Component,
  AfterViewInit,
  HostListener,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

// Services
import { ApiService } from '@shared/services/api/api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

// Components
import { GenericSuccessDialogComponent } from '@shared/components/generic-success-dialog/generic-success-dialog.component';

// Interfaces
import { SimplifiedUser } from '@core/user/interfaces/simplified-user.model';

@Component({
  selector: 'app-comunication-by-email',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatStepperModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
  ],
  templateUrl: './comunication-by-email.component.html',
  styleUrl: './comunication-by-email.component.scss',
})
export class ComunicationByEmailComponent implements AfterViewInit {
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isSmallScreen = window.innerWidth < 700;
  }
  isSmallScreen = window.innerWidth < 768;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('stepper') stepper!: MatStepper;

  dataSource = new MatTableDataSource<SimplifiedUser>();
  displayedColumns: string[] = [
    'id',
    'email',
    'documentType',
    'documentID',
    'userName',
    'role',
  ];

  displayedMessage: string = '';
  errorMessage: string = '';
  noCoincidences: boolean = false;
  pending: boolean = false;

  isChecked: boolean = false;
  selectedRow: SimplifiedUser | null = null;

  userForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
  });

  emailForm: FormGroup = new FormGroup(
    {
      subject: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required]),
    },
    { updateOn: 'blur' }
  );

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Usuarios por página:';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.nextPageLabel = 'Página siguiente';
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
    this.loadUsers();
  }

  openDialog(): void {
    this.dialog.open(GenericSuccessDialogComponent, {
      width: '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Email enviado',
        haveRouterLink: true,
        goTo: '/home',
      },
    });
  }

  loadUsers() {
    this.displayedMessage = '';
    this.apiService.getAll('users').subscribe({
      next: (response) => {
        if (response.data.length === 0) {
          this.displayedMessage = 'No hay usuarios registrados';
        } else {
          this.dataSource.data = response.data;
        }
      },
      error: () => {
        this.displayedMessage = '⚠️ Error de conexión';
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    if (this.dataSource.filteredData.length === 0) {
      this.noCoincidences = true;
    } else {
      this.noCoincidences = false;
    }
  }

  onSelectedRow(row: any) {
    this.selectedRow = row;
    this.userForm.get('email')?.setValue(row.email);
  }

  sendEmail() {
    if (!this.emailForm.invalid) {
      this.pending = true;
      this.apiService
        .sendEmail(this.emailForm.value, this.userForm.value.email)
        .subscribe({
          next: () => {
            this.pending = false;
            this.openDialog();
          },
          error: (error) => {
            this.pending = false;
            if (error.status !== 400) {
              this.errorMessage = 'Error en el servidor. Intente de nuevo.';
            } else {
              this.snackBarService.show('Error al enviar el email');
            }
          },
        });
    }
  }
}
