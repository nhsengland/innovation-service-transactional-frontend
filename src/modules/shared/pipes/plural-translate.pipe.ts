import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'pluralTranslate', standalone: true })
export class PluralTranslatePipe implements PipeTransform {
  transform(translation: string, count?: null | number): string {
    switch (count) {
      case undefined:
      case null:
      case 0:
        return `${translation}.none`;
      case 1:
        return `${translation}.singular`;
      default:
        return `${translation}.plural`;
    }
  }
}
