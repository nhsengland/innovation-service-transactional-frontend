import { Injectable } from '@angular/core';
import { InnovationRecordSchemaInfoType, InnovationRecordSchemaModel } from './innovation-record-schema.models';
import { InnovationRecordSchemaService } from './innovation-record-schema.service';
import { Store } from '@modules/stores/store.class';
import { Observable } from 'rxjs';
import { ContextStore } from '@modules/stores/context/context.store';
import { InnovationRecordQuestionStepType, SectionsSummaryModelV3Type } from '../202405/ir-v3-types';
import { SectionStepsList } from '@modules/shared/pages/innovation/sections/section-summary.component';
import { WizardIRV3EngineModel } from '@modules/shared/forms/engine/models/wizard-irv3-engine.model';
import { FormEngineModelV3 } from '@modules/shared/forms/engine/models/form-engine.models';
import { SectionsSummaryModel } from '../../innovation.models';
import { translateSectionIdEnums } from '../202405/ir-v3.helpers';
// import { getInnovationRecordSchemaTranslationsMap } from '../202405/ir-v3.helpers';

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

  getIrSchemaSectionsIdsListV3(): string[] {
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

  getSectionsSummary(currentSummary: SectionsSummaryModel): SectionsSummaryModelV3Type {
    const schema = this.contextStore.getIrSchema()?.schema.sections ?? [];

    const sectionsSummary = Object.fromEntries(
      currentSummary
        .flatMap(s => s.sections)
        .map(sub => [
          sub.id,
          {
            status: sub.status,
            submittedAt: sub.submittedAt,
            submittedBy: sub.submittedBy,
            isCompleted: sub.isCompleted,
            openTasksCount: sub.openTasksCount
          }
        ])
    );

    return schema.map(section => ({
      id: section.id,
      title: section.title,
      sections: section.subSections.map(s => ({
        id: s.id,
        title: s.title,
        status: sectionsSummary[translateSectionIdEnums(s.id)].status,
        submittedAt: sectionsSummary[translateSectionIdEnums(s.id)].submittedAt,
        submittedBy: sectionsSummary[translateSectionIdEnums(s.id)].submittedBy,
        isCompleted: sectionsSummary[translateSectionIdEnums(s.id)].isCompleted,
        openTasksCount: sectionsSummary[translateSectionIdEnums(s.id)].openTasksCount
      }))
    }));
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

  getIrSchemaQuestion(stepId: string): InnovationRecordQuestionStepType {
    const schema = this.contextStore.getIrSchema()?.schema.sections ?? [];
    return (
      schema.flatMap(section => section.subSections.flatMap(s => s.questions)).find(q => q.id === stepId) ?? {
        id: '',
        dataType: 'text',
        label: ''
      }
    );
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
    sectionId: string
  ): null | { group: { number: number; title: string }; section: { number: number; title: string } } {
    const schema = this.contextStore.getIrSchema()?.schema.sections ?? [];

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

  getIrSchemaTranslationsMap(): {
    sections: Map<string, string>;
    subsections: Map<string, string>;
    questions: Map<string, string>;
    items: Map<string, string>;
  } {
    const schema = this.contextStore.getIrSchema()?.schema.sections ?? [];

    // Sections & Subsections labels
    const flattenedSections = schema.flatMap(s => ({ id: s.id, label: s.title }));

    const flattenedSubSections = schema.flatMap(s => s.subSections.flatMap(sub => ({ id: sub.id, label: sub.title })));

    // Questions labels
    const flattenedQuestionsLabels = schema.flatMap(s =>
      s.subSections.flatMap(sub => sub.questions).flatMap(q => ({ id: q.id, label: q.label }))
    );
    const flattenedAddQuestionsLabels = schema
      .flatMap(s => s.subSections.flatMap(sub => sub.questions).flatMap(q => q.addQuestion))
      .flatMap(i => ({ id: i?.id ?? '', label: i?.label ?? '' }));

    // Items labels
    const flattenedItems = schema
      .flatMap(s => s.subSections.flatMap(sub => sub.questions).flatMap(q => q.items))
      .flatMap(i => ({ id: i?.id ?? '', label: i?.label ?? '' }));

    const flattenedAddQuestionItems = schema
      .flatMap(s => s.subSections.flatMap(sub => sub.questions).flatMap(q => q.addQuestion?.items))
      .flatMap(i => ({ id: i?.id ?? '', label: i?.label ?? '' }));

    return {
      sections: new Map(flattenedSections.map(s => [s.id, s.label])),
      subsections: new Map(flattenedSubSections.map(sub => [sub.id, sub.label])),
      questions: new Map([...flattenedQuestionsLabels, ...flattenedAddQuestionsLabels].map(q => [q.id, q.label])),
      items: new Map([...flattenedItems, ...flattenedAddQuestionItems].map(i => [i.id, i.label]))
    };
  }
}
