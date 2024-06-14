import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component.js';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, VehicleCardComponent],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.scss',
})
export class VehicleListComponent {
  vehiculos = [
    {
      modelo: 'Ford Mustang 1969',
      descripcion:
        'El Ford Mustang 1969 representa la esencia de los automóviles deportivos, con su diseño aerodinámico y su potente rendimiento',
      imagen:
        'https://http2.mlstatic.com/D_NQ_NP_642000-MLA70518447599_072023-O.webp',
    },
    {
      modelo: 'Tesla Model S',
      descripcion:
        'El Tesla Model S es un sedán eléctrico que cuenta con un impresionante rendimiento, ofreciendo una aceleración excepcional y una conducción suave y silenciosa',
      imagen:
        'https://cdn.topgear.es/sites/navi.axelspringer.es/public/media/image/2023/05/tesla-model-s-plaid-3027662.jpg?tf=3840x',
    },
    {
      modelo: 'Hyundai Kona Electric',
      descripcion:
        'El Hyundai Kona Electric es un SUV subcompacto eléctrico que proporciona el equilibrio ideal entre estilo, versatilidad y sostenibilidad',
      imagen:
        'https://media.ed.edmunds-media.com/hyundai/kona-electric/2024/oem/2024_hyundai_kona-electric_4dr-suv_limited_fq_oem_1_1600.jpg',
    },
    {
      modelo: 'Honda HR-V Crossover',
      descripcion:
        'El Honda HR-V Crossover ofrece una combinación perfecta de elegancia, funcionalidad y eficiencia',
      imagen:
        'https://autotest.com.ar/wp-content/uploads/2022/06/Honda-HR-V-2023-accio%CC%81n.jpg',
    },
  ];
}
