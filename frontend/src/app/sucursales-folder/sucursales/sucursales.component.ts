import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SucursalFormComponent } from '../sucursal-form/sucursal-form.component.js';
import { CreatedOrModifiedService } from '../../shared/created-or-modified/created-or-modified.service.js';

@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.component.html',
  styleUrl: './sucursales.component.scss',
  providers: [ApiService],
})
export class SucursalesComponent implements OnInit {
  sucursales: any[] = [];
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

  onSucursalDeleted(sucursalId: number): void {
    this.sucursales = this.sucursales.filter(
      (sucursal) => sucursal.id !== sucursalId
    );
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
    this.apiService.getAll('sucursales').subscribe((response) => {
      this.sucursales = response.data;
    });
  }

  newSucursal() {
    const modalRef = this.modalService.open(SucursalFormComponent, { size: 'l' , centered: true});
    modalRef.componentInstance.title = 'Nueva Sucursal'
  }
  
}
