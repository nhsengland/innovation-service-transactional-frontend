import { Injectable } from '@angular/core';
import {
  InnovationRecordSchemaInfoType,
  InnovationRecordSchemaModel,
  IrSchemaTranslatorMapType
} from './innovation-record-schema.models';
import { InnovationRecordSchemaService } from './innovation-record-schema.service';
import { Store } from '@modules/stores/store.class';
import { Observable } from 'rxjs';
import { ContextStore } from '@modules/stores/context/context.store';
import { SectionStepsList } from '@modules/shared/pages/innovation/sections/section-summary.component';
import { WizardIRV3EngineModel } from '@modules/shared/forms/engine/models/wizard-irv3-engine.model';
import { FormEngineModelV3 } from '@modules/shared/forms/engine/models/form-engine.models';
import { irSchemaTranslationsMap } from '../202405/ir-v3.helper';

@Injectable()
export class InnovationRecordSchemaStore extends Store<InnovationRecordSchemaModel> {
  constructor(
    private irSchemaService: InnovationRecordSchemaService,
    private contextStore: ContextStore
  ) {
    super('irSchema::Context', new InnovationRecordSchemaModel());
  }

  getLatestSchema$(): Observable<InnovationRecordSchemaInfoType> {
    return this.irSchemaService.getLatestSchema();
  }

  getIrSchemaSectionsListV3(): { id: string; title: string; sections: { id: string; title: string }[] }[] {
    const schema = this.contextStore.getIrSchema()?.schema.sections ?? [];

    return schema.map(s => ({
      id: s.id,
      title: s.title,
      sections: s.subSections.map(ss => ({ id: ss.id, title: ss.title }))
    }));
  }

  getIrSchemaSubSectionsIdsListV3(): string[] {
    const schema = this.contextStore.getIrSchema()?.schema.sections ?? [];

    return schema.flatMap(section => section.subSections.flatMap(s => s.id)) ?? [];
  }

  getIrSchemaSectionQuestionsIdsList(sectionId: string): string[] {
    const schema = this.contextStore.getIrSchema()?.schema.sections ?? [];

    return (
      schema
        .flatMap(section => section.subSections)
        .find(s => s.id === sectionId)
        ?.questions.map(q => q.id) ?? []
    );
  }

  getIrSchemaSectionsTreeV3(
    type: string,
    innovationId: string
  ): {
    label: string;
    url: string;
    children: { label: string; id: string; url: string }[];
  }[] {
    const schema = this.contextStore.getIrSchema()?.schema.sections ?? [];

    return schema.map((section, i) => ({
      label: `${i + 1}. ${section.title}`,
      url: `/${type}/innovations/${innovationId}/record/sections/${section.subSections[0].id}`,
      children: section.subSections.map((sub, k) => ({
        label: `${i + 1}.${k + 1} ${sub.title}`,
        id: `${sub.id}`,
        url: `/${type}/innovations/${innovationId}/record/sections/${sub.id}`
      }))
    }));
  }

  getIrSchemaSectionAllStepsList(sectionId: string): SectionStepsList {
    const schema = this.contextStore.getIrSchema()?.schema.sections ?? [];

    const section = schema.flatMap(s => s.subSections).find(sub => sub.id === sectionId);
    const flattenedQuestions =
      section?.questions.flatMap(q => [
        { label: q.label, conditional: !!q.condition },
        ...(q.addQuestion ? [{ label: q.addQuestion.label, conditional: true }] : [])
      ]) ?? [];

    return flattenedQuestions;
  }

  getIrSchemaSectionIdentificationV3(
    sectionId: string | null
  ): null | { group: { number: number; title: string }; section: { number: number; title: string } } {
    const schema = this.contextStore.getIrSchema()?.schema.sections ?? [];
    console.log('schema', schema);
    const section_group = schema.findIndex(s => s.subSections.find(sub => sub.id === sectionId)) ?? 0;

    const section = schema[section_group].subSections.findIndex(sub => sub.id === sectionId) ?? 0;
    return {
      group: { number: section_group + 1, title: schema[section_group].title },
      section: { number: section + 1, title: schema[section_group].subSections[section].title }
    };
  }

  getIrSchemaSectionV3(sectionId: string): {
    id: string;
    title: string;
    wizard: WizardIRV3EngineModel;
    evidences?: WizardIRV3EngineModel;
  } {
    const irSchema = this.contextStore.getIrSchema();
    const subsection = irSchema?.schema.sections.flatMap(s => s.subSections).find(sub => sub.id === sectionId);

    return {
      id: subsection?.id ?? '',
      title: subsection?.title ?? '',
      wizard: new WizardIRV3EngineModel({
        schema: irSchema,
        translations: this.getIrSchemaTranslationsMap(),
        sectionId: subsection?.id,
        steps: subsection!.questions.map(
          question =>
            new FormEngineModelV3({
              parameters: []
            })
        )
      })
    };
  }

  getIrSchemaNumberedSubSectionsList(): { value: string; label: string }[] {
    const schema = this.contextStore.getIrSchema()?.schema.sections ?? [];

    return schema.reduce((sectionGroupAcc: { value: string; label: string }[], sectionGroup, i) => {
      return [
        ...sectionGroupAcc,
        ...sectionGroup.subSections.reduce((sectionAcc: { value: string; label: string }[], section, j) => {
          return [...sectionAcc, ...[{ value: section.id, label: `${i + 1}.${j + 1} ${section.title}` }]];
        }, [])
      ];
    }, []);
  }

  getIrSchemaTranslationsMap(): IrSchemaTranslatorMapType {
    const schema = this.contextStore.getIrSchema()?.schema ?? { sections: [] };
    return irSchemaTranslationsMap(schema);
  }
}
