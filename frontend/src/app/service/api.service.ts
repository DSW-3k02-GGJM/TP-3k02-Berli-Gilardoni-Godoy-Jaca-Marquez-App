import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  /*
  getAvailableVehicleModelsHandler(fechaDesde: string, fechaHasta: string) {
    throw new Error('Method not implemented.');
  }
  */

  private apiUrl = 'http://localhost:3000/api';
  httpClient: any;

  constructor(private http: HttpClient) {}

  getAll(entity: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${entity}`);
  }

  getOne(entity: string, id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${entity}/${id}`);
  }

  create(entity: string, data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(`${this.apiUrl}/${entity}`, data, {
      headers: headers,
    });
  }

  update(entity: string, id: number, data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put(`${this.apiUrl}/${entity}/${id}`, data, {
      headers: headers,
    });
  }

  delete(entity: string, id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${entity}/${id}`);
  }

  // agregue esto para hacer el filtro...
  /*getAvailableVehicles(fechaDesde: string, fechaHasta: string) {
    return this.http.get<any>(`/api/vehicleModels/available?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`);
  }
  getAvailableVehicleModels(fechaDesde: string, fechaHasta: string) {
    const params = { fechaDesde, fechaHasta };
    return this.http.get<any>('API_URL/vehicleModels/available', { params });
  }*/

  // despues probar con getAvailableVehicleModelsHandler
  getAvailableVehicleModels(startDate: string, endDate: string, location: string): Observable<any> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('location', location);
    console.log(`${this.apiUrl}/vehicles/available?startDate=${startDate}&endDate=${endDate}&location=${location}`);
    console.log(this.http.get<any>(`${this.apiUrl}/vehicles/available?startDate=${startDate}&endDate=${endDate}&location=${location}`));
    return this.http.get<any>(`${this.apiUrl}/vehicles/available?startDate=${startDate}&endDate=${endDate}&location=${location}`);
  }


}
