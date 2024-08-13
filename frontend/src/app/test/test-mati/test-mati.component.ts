import { Component } from '@angular/core';
import { TestComponenteComponent } from '../test-componente/test-componente.component.js';

@Component({
  selector: 'app-test-mati',
  standalone: true,
  imports: [TestComponenteComponent],
  templateUrl: './test-mati.component.html',
  styleUrl: './test-mati.component.scss'
})
export class TestMatiComponent {
  
}
