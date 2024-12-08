import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, HostListener, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../service/api.service.js';
import { Brand } from '../../test/test-mati/test-mati.component.js';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { GenericSuccesDialogComponent } from '../../shared/generic-succes-dialog/generic-succes-dialog.component.js';

@Component({
  selector: 'app-comunication-by-email',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatStepperModule,
    MatTableModule, 
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './comunication-by-email.component.html',
  styleUrl: './comunication-by-email.component.scss'
})
export class ComunicationByEmailComponent implements AfterViewInit {
  readonly dialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(GenericSuccesDialogComponent, {
      width: '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: 'Email envíado',
      },
    });
  }
  dataSource = new MatTableDataSource<User>();
  displayedColumns: string[] = ['id', 'email', 'documentType', 'documentID', 'userName', 'role'];
  isChecked = false;
  selectedRow: User | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('stepper') stepper!: MatStepper;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth < 700;
  }
  isSmallScreen = window.innerWidth < 768;
  errorMessage: string = '';
  pending = false;

  userForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required]),
    }
  );

  emailForm: FormGroup = new FormGroup(
    {
      subject: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required]),
    }
  );

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Usuarios por página:';
    this.paginator._intl.nextPageLabel = 'Página siguiente';	
    this.paginator._intl.previousPageLabel = 'Página anterior';		
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`;
    }
    this.loadUsers();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadUsers() {
    this.apiService.getAll('users').subscribe((response) => {
      this.dataSource.data = response.data;
    });
  }

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) { }

  onSelectedRow(row: any) {
    this.selectedRow = row;
    this.userForm
      .get('email')
      ?.setValue(row.email);
  }
  sendEmail() {
    if(!this.emailForm.invalid) {
      this.pending = true;
      this.apiService
        .sendEmail(this.emailForm.value, this.userForm.value.email)
        .subscribe({
          next: response => {
            this.pending = false;
            this.openDialog();
          },
          error: error => {
            this.pending = false;
            if (error.status !== 400) {
              console.log(error);
              this.errorMessage = "Error en el servidor. Intente de nuevo.";
            }
          }
        });
    
    }
  }
}


export interface User {
  id: number;
  email: string;
  documentType: string;
  documentID: string;
  userName: string;
  role: string;
}