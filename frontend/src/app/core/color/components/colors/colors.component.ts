// Angular
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { ColorApiService } from '@core/color/services/color.api.service';
import { OpenDialogService } from '@shared/services/notifications/open-dialog.service';

// Components
import { ColorsTableComponent } from '@core/color/components/colors-table/colors-table.component';

// Interfaces
import { Color } from '@core/color/interfaces/color.interface';
import { ColorsResponse } from '@core/color/interfaces/colors-response.interface';
import { ErrorDialogOptions } from '@shared/interfaces/generic-dialog.interface';
@Component({
  selector: 'app-colors',
  standalone: true,
  templateUrl: './colors.component.html',
  styleUrl: '../../../../shared/styles/generic-new-button.scss',
  imports: [CommonModule, ColorsTableComponent],
})
export class ColorsComponent implements OnInit {
  colors: Color[] = [];

  constructor(
    private readonly colorApiService: ColorApiService,
    private readonly openDialogService: OpenDialogService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onColorDeleted(): void {
    this.loadData();
  }

  private loadData(): void {
    this.colorApiService.getAll().subscribe({
      next: (response: ColorsResponse) => this.handleSuccess(response),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  private handleSuccess(response: ColorsResponse): void {
    this.colors = response.data;
  }

  private handleError(error: HttpErrorResponse): void {
    this.openDialogService.error({
      message: error.error?.message,
      goTo: '/home',
    } as ErrorDialogOptions);
  }

  newColor(): void {
    this.router.navigate(['/staff/colors/create']);
  }
}
