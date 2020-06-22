import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nutzungPipe'
})
export class NutzungPipePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
