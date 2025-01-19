// Angular
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { ColorApiService } from '@core/color/services/color.api.service';

// Components
import { ColorsTableComponent } from '@core/color/components/colors-table/colors-table.component';

// Interfaces
import { Color } from '@core/color/interfaces/color.interface';
import { ColorsResponse } from '@core/color/interfaces/colors-response.interface';

@Component({
  selector: 'app-colors',
  standalone: true,
  templateUrl: './colors.component.html',
  styleUrl: '../../../../shared/styles/generic-new-button.scss',
  imports: [CommonModule, ColorsTableComponent],
})
export class ColorsComponent implements OnInit {
  colors: Color[] = [];
  errorMessage: string = '';

  constructor(
    private readonly colorApiService: ColorApiService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onColorDeleted(): void {
    this.loadData();
  }

  loadData(): void {
    this.colorApiService.getAll().subscribe({
      next: (response: ColorsResponse) => (this.colors = response.data),
      error: () => (this.errorMessage = '⚠️ Error de conexión'),
    });
  }

  newColor(): void {
    this.router.navigate(['/staff/colors/create']);
  }
}
