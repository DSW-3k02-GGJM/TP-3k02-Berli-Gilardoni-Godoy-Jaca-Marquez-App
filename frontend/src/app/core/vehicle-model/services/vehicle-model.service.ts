import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VehicleModelService {
  // No se bien si lo estoy usando actualmente (revisar)
  private apiUrl = 'http://localhost:3000/api/upload';

  constructor(private http: HttpClient) {}

  uploadVehicleModelImage(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
}
