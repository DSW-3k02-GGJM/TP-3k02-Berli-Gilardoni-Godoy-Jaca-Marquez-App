import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[app-prevent-enter]',
  standalone: true,
})
export class PreventEnterDirective {
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }
}
