import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleModelService {
  private apiUrl = 'http://localhost:3000/api/upload'; // Ajusta la URL según sea necesario

  constructor(private http: HttpClient) {}

  uploadVehicleModelImage(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }

  // Otros métodos del servicio
}