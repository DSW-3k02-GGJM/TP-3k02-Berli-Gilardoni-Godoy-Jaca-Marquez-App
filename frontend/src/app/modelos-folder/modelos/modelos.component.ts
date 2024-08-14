import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModeloFormComponent } from '../modelo-form/modelo-form.component.js';
import { CreatedOrModifiedService } from '../../shared/created-or-modified/created-or-modified.service.js';

@Component({
  selector: 'app-modelos',
  templateUrl: './modelos.component.html',
  styleUrl: './modelos.component.scss',
  providers: [ApiService],
})
export class ModelosComponent implements OnInit {
  modelos: any[] = [];
  private subscription?: Subscription;

  constructor(
    private apiService: ApiService,
    private createdOrModifiedService: CreatedOrModifiedService,
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
      this.createdOrModifiedService.createdOrModified.subscribe(
        () => {
          this.loadData();
        }
      );

    if (!this.createdOrModifiedService.isDataLoaded) {
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
