import { Component } from '@angular/core';
import { TestComponenteComponent } from '../test-componente/test-componente.component.js';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';


@Component({
  selector: 'app-test-mati',
  standalone: true,
  imports: [TestComponenteComponent, ],
  templateUrl: './test-mati.component.html',
  styleUrl: './test-mati.component.scss'
})
export class TestMatiComponent {
  constructor(private http: HttpClient) { }
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
