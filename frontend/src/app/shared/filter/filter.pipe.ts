import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})

export class FilterPipe implements PipeTransform {
  transform(value: any, arg: any, key: string): any {
    if (arg.length < 3) return value;
    const result = [];
    for (const row of value) {
      // Verifica si la clave es anidada
      const keys = key.split('.');
      let fieldValue = row;
      for (const k of keys) {
        fieldValue = fieldValue ? fieldValue[k] : null;
      }
      if (fieldValue && fieldValue.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        result.push(row);
      }
    }
    return result;
  }
}


