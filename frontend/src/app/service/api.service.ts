import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, delay, map, Observable, of } from 'rxjs';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
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
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'true',
  });

  httpClient: any;

  constructor(private http: HttpClient) {}

  getAll(entity: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${entity}`,  {
      headers: this.headers,
      withCredentials: true,
    });
  }

  getOne(entity: string, id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${entity}/${id}`, {
      withCredentials: true,
    });
  }

  create(entity: string, data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(`${this.apiUrl}/${entity}`, data, {
      headers: headers,
      withCredentials: true,
    });
  }

  update(entity: string, id: number, data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put(`${this.apiUrl}/${entity}/${id}`, data, {
      headers: headers,
      withCredentials: true,
    });
  }

  delete(entity: string, id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${entity}/${id}`, {
      withCredentials: true,
    });
  }

  entityNameExists(entity: string, entityName: string, id: number): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/${entity}/entityName-exists/${entityName}/${id}`, {
      withCredentials: true,
    })
      .pipe(
        delay(1000),
        map(response => response.exists),
        catchError(() => of(false))
      );
  }

  uniqueEntityNameValidator(entity: string, id: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.entityNameExists(entity, control.value, id).pipe(
        map((exists) => (exists ? { entityNameExists: true } : null)),
        catchError(async () => null)
      );
    };
  }

  // agregue esto para hacer el filtro...
  /*getAvailableVehicles(fechaDesde: string, fechaHasta: string) {
    return this.http.get<any>(`/api/vehicleModels/available?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`);
  }
  getAvailableVehicleModels(fechaDesde: string, fechaHasta: string) {
    const params = { fechaDesde, fechaHasta };
    return this.http.get<any>('API_URL/vehicleModels/available', { params });
  }*/

  //TODO: DUDOSO, posiblemente haya que borrar y no sirva para nada
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
