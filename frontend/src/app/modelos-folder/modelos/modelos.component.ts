import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { ModelosTableComponent } from '../modelos-table/modelos-table.component';
import { ModeloCreatedOrModifiedService } from '../client-created-or-modified/client-created-or-modified.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modelos',
  standalone: true,
  templateUrl: './modelos.component.html',
  styleUrl: './modelos.component.scss',
  imports: [CommonModule, HttpClientModule, ModelosTableComponent],
  providers: [ApiService],
})
export class ModelosComponent implements OnInit {
  modelos: any[] = [];
  private subscription?: Subscription;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private modeloCreatedOrModifiedService: ModeloCreatedOrModifiedService
  ) {}

  ngOnInit(): void {
    this.fillData();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onModeloDeleted(modeloId: number): void {
    this.modelos = this.modelos.filter((modelo) => modelo.id !== modeloId);
  }

  fillData() {
    this.subscription =
      this.modeloCreatedOrModifiedService.modeloCreatedOrModified.subscribe(
        () => {
          this.loadData();
        }
      );

    if (!this.modeloCreatedOrModifiedService.isDataLoaded) {
      this.loadData();
    }
  }

  loadData() {
    this.apiService.getAll('modelos').subscribe((response) => {
      this.modelos = response.data;
    });
  }

  navigateToNewModelo(): void {
    this.router.navigate(['/modelos/creacion']);
  }
}
