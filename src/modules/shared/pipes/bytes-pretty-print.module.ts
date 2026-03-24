import { NgModule } from '@angular/core';
import { BytesPrettyPrintPipe } from './bytes-pretty-print.pipe';

@NgModule({
  declarations: [BytesPrettyPrintPipe],
  exports: [BytesPrettyPrintPipe]
})
export class BytesPrettyPrintPipeModule {}