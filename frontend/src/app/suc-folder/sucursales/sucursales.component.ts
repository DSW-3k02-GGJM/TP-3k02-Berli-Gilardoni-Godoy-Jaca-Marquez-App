import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { SucursalesTableComponent } from '../sucursales-table/sucursales-table.component';
import { SucursalCreatedOrModifiedService } from '../sucursal-created-or-modified/suc.service';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SucursalFormComponent } from '../sucursal-form/sucursal-form.component';

@Component({
  selector: 'app-sucursales',
  standalone: true,
  templateUrl: './sucursales.component.html',
  styleUrl: './sucursales.component.scss',
  imports: [CommonModule, HttpClientModule, SucursalesTableComponent],
  providers: [ApiService],
})
export class SucursalesComponent implements OnInit {
  sucursales: any[] = [];
  private subscription?: Subscription;

  constructor(
    private apiService: ApiService,
    private sucursalCreatedOrModifiedService: SucursalCreatedOrModifiedService,
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
      this.sucursalCreatedOrModifiedService.sucursalCreatedOrModified.subscribe(
        () => {
          this.loadData();
        }
      );

    if (!this.sucursalCreatedOrModifiedService.isDataLoaded) {
      this.loadData();
    }
  }

  loadData() {
    this.apiService.getAll('sucursales').subscribe((response) => {
      this.sucursales = response.data;
    });
  }

  newSucursal() {
    const modalRef = this.modalService.open(SucursalFormComponent, {
      size: 'l',
      centered: true,
    });
    modalRef.componentInstance.title = 'Nueva Sucursal';
  }
}
