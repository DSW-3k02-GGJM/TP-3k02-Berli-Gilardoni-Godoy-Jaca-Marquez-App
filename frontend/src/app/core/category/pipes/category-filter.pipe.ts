// Angular
import { Pipe, PipeTransform } from '@angular/core';

// Interfaces
import { Category } from '@core/category/interfaces/category.interface';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class CategoryFilterPipe implements PipeTransform {
  transform(value: Category[], arg: string, key: string): Category[] {
    if (arg.length < 3) return value;
    return value.filter((row: Category) =>
      row[key as keyof Category]
        .toString()
        .toLowerCase()
        .includes(arg.toLowerCase())
    );
  }
}
