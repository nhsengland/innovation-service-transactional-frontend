import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'joinArray' })
export class JoinArrayPipe implements PipeTransform {
    transform(value: unknown[], separator: string = ', ') {
      return value.join(separator);
    }
}
