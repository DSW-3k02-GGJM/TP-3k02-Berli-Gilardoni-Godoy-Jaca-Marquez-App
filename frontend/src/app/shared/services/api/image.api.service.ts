// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// RxJS
import { Observable } from 'rxjs';

// Interfaces
import { UploadImageResponse } from '@shared/interfaces/upload-image-response.interface';
import { Message } from '@shared/interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class ImageApiService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getImageServerUrl(): Observable<{ imageServerUrl: string }> {
    return this.http.get<{ imageServerUrl: string }>(`${this.apiUrl}/config`);
  }

  uploadImage(file: File): Observable<UploadImageResponse> {
    const formData: FormData = new FormData();
    formData.append('image', file);

    return this.http.post<UploadImageResponse>(
      `${this.apiUrl}/upload`,
      formData
    );
  }

  deleteImage(imagePath: string): Observable<Message> {
    return this.http.delete<Message>(`${this.apiUrl}/upload/${imagePath}`);
  }
}
