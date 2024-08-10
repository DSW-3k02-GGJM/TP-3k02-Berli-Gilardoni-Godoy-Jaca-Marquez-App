import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {ApiService} from "../../service/api.service";
import {SucursalesTableComponent} from "../sucursales-table/sucursales-table.component";
import {SucursalCreatedOrModifiedService} from "../sucursal-created-or-modified/sucursal-created-or-modified.service";
import {Subscription} from "rxjs";

@Component({
  imports: [CommonModule, HttpClientModule, SucursalesTableComponent],
  providers: [ApiService],
  selector: 'app-sucursales',
  standalone: true,
  styleUrl: './sucursales.component.scss',
  templateUrl: './sucursales.component.html',
})
export class SucursalesComponent implements OnInit {
  sucursales: any[] = [];
  private subscription?: Subscription;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private sucursalCreatedOrModifiedService: SucursalCreatedOrModifiedService
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

  navigateToNewSucursal(): void {
    this.router.navigate(['/sucursales/creacion']);
  }
}
