// Angular
import { Pipe, PipeTransform } from '@angular/core';

// Interfaces
import { User } from '@core/user/interfaces/user.interface';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class UserFilterPipe implements PipeTransform {
  transform(value: User[], arg: string, key: string): User[] {
    if (arg.length < 3) return value;
    return value.filter((row: User) =>
      row[key as keyof User]
        .toString()
        .toLowerCase()
        .includes(arg.toLowerCase())
    );
  }
}
