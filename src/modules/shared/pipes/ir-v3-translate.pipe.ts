import { Pipe, PipeTransform } from '@angular/core';
import { InnovationRecordSchemaStore } from '@modules/stores';
// import { getInnovationRecordSchemaTranslationsMap } from '@modules/stores/innovation/innovation-record/202405/ir-v3.helpers';

@Pipe({ name: 'irv3translate' })
export class IrV3TranslatePipe implements PipeTransform {
  constructor(private irSchemaStore: InnovationRecordSchemaStore) {}
  transform(value: string | string[] | undefined): string {
    let translated: string = '';
    if (typeof value === 'string') {
      translated = this.irSchemaStore.getIrSchemaTranslationsMap().items.get(value) ?? value;
    } else if (value instanceof Array) {
      let translatedArr: string[] = [];
      value.forEach(v => translatedArr.push(this.irSchemaStore.getIrSchemaTranslationsMap().items.get(v) ?? v));
      translated = translatedArr.join(', ');
    }

    return translated;
  }
}
