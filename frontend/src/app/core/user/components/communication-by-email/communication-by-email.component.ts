// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  AfterViewInit,
  HostListener,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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
import { UserApiService } from '@core/user/services/user.api.service';
import { SnackBarService } from '@shared/services/notifications/snack-bar.service';

// Components
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import { User } from '@core/user/interfaces/user.interface';
import { UsersResponse } from '@core/user/interfaces/users-response.interface';
import { EmailData } from '@core/user/interfaces/email-data.interface';
import { GenericDialog } from '@shared/interfaces/generic-dialog.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

@Component({
  selector: 'app-communication-by-email',
  standalone: true,
  templateUrl: './communication-by-email.component.html',
  styleUrls: [
    '../../../../shared/styles/generic-form.scss',
    './communication-by-email.component.scss',
  ],
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
    PreventEnterDirective,
  ],
})
export class CommunicationByEmailComponent implements AfterViewInit {
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isSmallScreen = this.isSmallScreenWidth();
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('stepper') stepper!: MatStepper;

  isSmallScreen: boolean = this.isSmallScreenWidth();

  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
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
  selectedRow: User | null = null;

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
    private readonly userApiService: UserApiService,
    private readonly snackBarService: SnackBarService,
    private readonly dialog: MatDialog
  ) {}

  ngAfterViewInit(): void {
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
      const startIndex: number = page * pageSize;
      const endIndex: number =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}` as string;
    };
    this.loadUsers();
  }

  private isSmallScreenWidth(): boolean {
    return window.innerWidth < 768;
  }

  openDialog(): void {
    this.dialog.open(GenericDialogComponent, {
      width: '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Email enviado',
        titleColor: 'dark',
        image: 'assets/generic/checkmark.png',
        showBackButton: false,
        mainButtonTitle: 'Aceptar',
        haveRouterLink: true,
        goTo: '/home',
      },
    } as GenericDialog);
  }

  loadUsers(): void {
    this.displayedMessage = '';
    this.userApiService.getAll().subscribe({
      next: (response: UsersResponse) => {
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

  applyFilter(event: Event): void {
    const filterValue: string = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.filteredData.length === 0) {
      this.noCoincidences = true;
    } else {
      this.noCoincidences = false;
    }
  }

  onSelectedRow(row: User): void {
    this.selectedRow = row;
    this.userForm.get('email')?.setValue(row.email as string);
  }

  sendEmail(): void {
    if (!this.emailForm.invalid) {
      this.pending = true;
      this.userApiService
        .sendEmail(
          this.userForm.value.email as string,
          this.emailForm.value as EmailData
        )
        .subscribe({
          next: () => {
            this.pending = false;
            this.openDialog();
          },
          error: (error: HttpErrorResponse) => {
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
