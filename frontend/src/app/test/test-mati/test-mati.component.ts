import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TestComponenteComponent } from '../test-componente/test-componente.component.js';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../service/api.service.js';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-test-mati',
  standalone: true,
  imports: [TestComponenteComponent, FormsModule, MatFormFieldModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, MatSlideToggleModule, MatButtonModule],
  templateUrl: './test-mati.component.html',
  styleUrl: './test-mati.component.scss'
})
export class TestMatiComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<Brand>();
  displayedColumns: string[] = ['id', 'email', 'documentType', 'documentID', 'userName', 'role'];
  isChecked = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
  }

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
    this.loadBrands();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadBrands() {
    this.apiService.getAll('users').subscribe((response) => {
      this.dataSource.data = response.data;
    });
  }

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) { }
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'true',
  });
  cliente() {
    this.http.post(`api/users/client`,{
      headers: this.headers,
      withCredentials: true,
    }).subscribe((res) => {
      console.log(res);
    });  
  }
  admin() {
    this.http.post(`api/users/admin`,{
      headers: this.headers,
      withCredentials: true,
    }).subscribe((res) => {
      console.log(res);
    });
  }
  empleado() {
    this.http.post(`api/users/employee`,{
      headers: this.headers,
      withCredentials: true,
    }).subscribe((res) => {
      console.log(res);
    });
  }
  
}

export interface Brand {
  id: number;
  brandName: string;
}
