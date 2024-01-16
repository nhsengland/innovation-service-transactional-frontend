import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'bytesPrettyPrint' })
export class BytesPrettyPrintPipe implements PipeTransform {
  transform(bytes: number): string {
    if (!bytes || bytes === 0) {
      return '';
    }

    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i: number = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());

    if (i === 0) return `${bytes} ${sizes[i]}`;

    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }
}
