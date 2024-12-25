// Angular
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Services
import { ApiService } from '../../../shared/services/api/api.service';

// Interfaces
import { Brand } from '../../interfaces/brand.model';

@Component({
  selector: 'app-test-mati',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: './test-mati.component.html',
  styleUrl: './test-mati.component.scss',
})
export class TestMatiComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<Brand>();
  displayedColumns: string[] = [
    'id',
    'email',
    'documentType',
    'documentID',
    'userName',
    'role',
  ];

  isChecked = false;

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'true',
  });

  constructor(private apiService: ApiService, private http: HttpClient) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Usuarios por página:';
    this.paginator._intl.nextPageLabel = 'Página siguiente';
    this.paginator._intl.previousPageLabel = 'Página anterior';
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
    this.loadBrands();
  }

  loadBrands() {
    this.apiService.getAll('users').subscribe({
      next: (response) => (this.dataSource.data = response.data),
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  client() {
    this.http
      .post(`api/users/client`, {
        headers: this.headers,
        withCredentials: true,
      })
      .subscribe({
        next: (res) => console.log(res),
      });
  }

  admin() {
    this.http
      .post(`api/users/admin`, {
        headers: this.headers,
        withCredentials: true,
      })
      .subscribe({
        next: (res) => console.log(res),
      });
  }

  employee() {
    this.http
      .post(`api/users/employee`, {
        headers: this.headers,
        withCredentials: true,
      })
      .subscribe({
        next: (res) => console.log(res),
      });
  }
}
