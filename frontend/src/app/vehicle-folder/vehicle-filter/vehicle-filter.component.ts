import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateFilterService } from '../../shared/date-filter.service';

@Component({
  selector: 'app-vehicle-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './vehicle-filter.component.html',
  styleUrls: ['./vehicle-filter.component.scss'],
})
export class VehicleFilterComponent {
  startDate: string = '';
  endDate: string = '';
  /*
  startDate1: Date | null = null;
  endDate1: Date | null = null;*/
  startDate1: Date | null = null;
  endDate1: Date | null = null;

  // enviamos las fechas a la list componente
  @Output() filterApplied = new EventEmitter<{ startDate: string; endDate: string }>();
  //constructor(private dateFilterService: DateFilterService) {}

  // el botoncito
  applyFilter() {
    
    this.filterApplied.emit({ startDate: this.startDate, endDate: this.endDate });
    /*
    if (this.startDate) { // por si es nulo
      if (this.startDate1) {
        this.dateFilterService.setStartDate(this.startDate1);
      }
    }
    if (this.endDate) {
      if (this.endDate1) {
        this.dateFilterService.setEndDate(this.endDate1);
      }
    }
   // DEBERIA HACER Q LAS FECHAS SEAN STRINGS
   console.log("aaaa");
      if (this.startDate && this.startDate1) {
        this.dateFilterService.setStartDate(this.startDate1);
      }
      if (this.endDate && this.endDate1) {
        this.dateFilterService.setEndDate(this.endDate1);
      }*/
  }


}
