import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehicle-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './vehicle-filter.component.html',
  styleUrls: ['./vehicle-filter.component.scss'],
})
export class VehicleFilterComponent {
  fechaDesde: string = '';
  fechaHasta: string = '';

  // enviamos las fechas a la list componente
  @Output() filterApplied = new EventEmitter<{ fechaDesde: string; fechaHasta: string }>();

  // el botoncito
  applyFilter() {
    this.filterApplied.emit({ fechaDesde: this.fechaDesde, fechaHasta: this.fechaHasta });
  }

  
}
