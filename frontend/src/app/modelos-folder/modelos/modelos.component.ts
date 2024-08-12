import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { ModelosTableComponent } from '../modelos-table/modelos-table.component';
import { ModeloCreatedOrModifiedService } from '../modelo-created-or-modified/modelo-created-or-modified.service';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModeloFormComponent } from '../modelo-form/modelo-form.component.js';

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
    private modeloCreatedOrModifiedService: ModeloCreatedOrModifiedService,
    private modalService: NgbModal
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

  newModelo() {
    const modalRef = this.modalService.open(ModeloFormComponent, { size: 'l' , centered: true});
    modalRef.componentInstance.title = 'Nuevo Modelo'
  }
}
