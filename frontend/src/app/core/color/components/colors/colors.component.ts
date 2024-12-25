// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Services
import { ApiService } from '@shared/services/api/api.service';

// Components
import { ColorsTableComponent } from '../colors-table/colors-table.component';

@Component({
  selector: 'app-colors',
  standalone: true,
  templateUrl: './colors.component.html',
  styleUrl: './colors.component.scss',
  imports: [CommonModule, ColorsTableComponent],
  providers: [ApiService],
})
export class ColorsComponent implements OnInit {
  colors: any[] = [];
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fillData();
  }

  onColorDeleted(id: number): void {
    this.colors = this.colors.filter((color) => color.id !== id);
  }

  fillData() {
    this.apiService.getAll('colors').subscribe({
      next: (response) => (this.colors = response.data),
      error: () => (this.errorMessage = '⚠️ Error de conexión'),
    });
  }

  newColor() {
    this.router.navigate(['/staff/colors/create']);
  }
}
