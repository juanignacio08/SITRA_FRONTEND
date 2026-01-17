import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'horaSinMs',
  standalone: true,
})
export class HoraSinMsPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    return value ? value.split('.')[0] : '---';
  }

}
