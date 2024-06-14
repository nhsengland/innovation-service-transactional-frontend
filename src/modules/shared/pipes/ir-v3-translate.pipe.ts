import { Pipe, PipeTransform } from '@angular/core';
import { InnovationRecordSchemaStore } from '@modules/stores';

@Pipe({ name: 'irv3translate' })
export class IrV3TranslatePipe implements PipeTransform {
  constructor(private irSchemaStore: InnovationRecordSchemaStore) {}
  transform(
    value: string | string[] | undefined,
    type: 'sections' | 'subsections' | 'questions' | 'items',
    questionId?: string
  ): string {
    const translations = this.irSchemaStore.getIrSchemaTranslationsMap();

    switch (type) {
      case 'sections':
      case 'subsections':
        return translations[type].get(value as string) ?? '';
      case 'questions':
        return translations[type].get(value as string)?.label ?? (value as string);
      case 'items':
        if (typeof value === 'string' && questionId) {
          return translations['questions'].get(questionId)?.items?.get(value)?.label ?? value;
        } else if (value instanceof Array && questionId) {
          let translatedArr: string[] = [];
          value.forEach(v => translatedArr.push(translations['questions'].get(questionId)?.items?.get(v)?.label ?? v));
          return translatedArr.join(', ');
        }
    }

    return '';
  }
}
