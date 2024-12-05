import { Injectable, computed, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import {
  catchError,
  combineLatest,
  debounceTime,
  filter,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  tap,
  throwError
} from 'rxjs';
import { ContextSchemaType, EMPTY_SCHEMA_CONTEXT, IrSchemaTranslatorMapType } from './schema.types';
import { SchemaContextService } from './schema.service';
import { SectionStepsList } from '@modules/shared/pages/innovation/sections/section-summary.component';
import { WizardIRV3EngineModel } from '@modules/shared/forms/engine/models/wizard-engine-irv3-schema.model';
import { FormEngineModelV3 } from '@modules/shared/forms/engine/models/form-engine.models';
import { irSchemaTranslationsMap } from '../../innovation/innovation-record/202405/ir-v3-schema-translation.helper';
import { InnovationRecordQuestionStepType } from '../../innovation/innovation-record/202405/ir-v3-types';
import { stepsLabels } from '../../innovation/innovation-record/202405/evidences-section-2-2.config';

const EXPIRATION_IN_MS = 60000;

@Injectable()
export class SchemaContextStore {
  // State
  private state = signal<ContextSchemaType>({
    irSchema: EMPTY_SCHEMA_CONTEXT,
    expiresAt: 0,
    isStateLoaded: false
  });

  // Selectors
  irSchemaInfo = computed(() => this.state().irSchema);
  schema = computed(() => this.irSchemaInfo().schema.sections); // Returns directly the sections for ease of use (99% of the times we access directly the sections).

  getSectionsList = computed(() =>
    this.schema().map(s => ({
      id: s.id,
      title: s.title,
      sections: s.subSections.map(ss => ({ id: ss.id, title: ss.title }))
    }))
  );
  getSubSectionsIds = computed(() => this.schema().flatMap(section => section.subSections.flatMap(s => s.id)) ?? []);

  isStateLoaded = computed(() => this.state().isStateLoaded);
  isStateLoaded$ = toObservable(this.isStateLoaded);
  hasError = computed(() => this.state().error);
  hasError$ = toObservable(this.hasError);

  // Actions
  fetch$ = new Subject<void>();

  constructor(private schemaService: SchemaContextService) {
    // Reducers
    this.fetch$
      .pipe(
        debounceTime(50),
        tap(() => {
          this.state.update(state => ({ ...state, isStateLoaded: false, error: undefined }));
        }),
        switchMap(() =>
          this.schemaService.getLatestSchema().pipe(
            catchError(error => {
              this.state.update(state => ({ ...state, error }));
              return of(null);
            })
          )
        )
      )
      .subscribe(irSchema => {
        if (irSchema) {
          this.state.set({ irSchema, expiresAt: Date.now() + EXPIRATION_IN_MS, isStateLoaded: true });
        }
      });
  }

  clear(): void {
    this.state.update(() => ({ irSchema: EMPTY_SCHEMA_CONTEXT, expiresAt: 0, isStateLoaded: false, error: undefined }));
  }

  getOrLoad$(): Observable<ContextSchemaType['irSchema']> {
    const state = this.state();
    if (state.isStateLoaded && Date.now() < state.expiresAt) {
      return of(state.irSchema);
    }

    this.fetch$.next();
    return combineLatest([this.isStateLoaded$, this.hasError$]).pipe(
      filter(() => this.isStateLoaded() || this.hasError() !== undefined),
      switchMap(() => {
        if (this.hasError()) {
          return throwError(() => this.hasError());
        }
        return of(this.irSchemaInfo());
      }),
      take(1)
    );
  }

  // Helper functions
  getIrSchemaSectionQuestionsIdsList(sectionId: string): string[] {
    return (
      this.schema()
        .flatMap(section => section.subSections)
        .find(s => s.id === sectionId)
        ?.steps.flatMap(st => st.questions)
        .map(q => q.id) ?? []
    );
  }

  getIrSchemaSectionQuestions(sectionId: string): InnovationRecordQuestionStepType[] {
    return (
      this.schema()
        .flatMap(section => section.subSections)
        .find(s => s.id === sectionId)
        ?.steps.flatMap(st => st.questions) ?? []
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
    return this.schema().map((section, i) => ({
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
    const section = this.schema()
      .flatMap(s => s.subSections)
      .find(sub => sub.id === sectionId);
    const flattenedQuestions =
      section?.steps.flatMap(st =>
        st.questions.flatMap(q => [
          { label: q.label, conditional: !!st.condition },
          ...(q.addQuestion ? [{ label: q.addQuestion.label, conditional: true }] : [])
        ])
      ) ?? [];

    // add conditional questions regarding 'EVIDENCE_OF_EFFECTIVENESS' (evidences still uses previous wizard and its config file)
    if (sectionId === 'EVIDENCE_OF_EFFECTIVENESS') {
      flattenedQuestions.push(...Object.values(stepsLabels));
    }

    // add conditional questions special cases regarding 'TESTING_WITH_USERS' and 'REGULATIONS_AND_STANDARDS', specifically questions with template tags (i.e.: {{item}} )
    if (sectionId === 'TESTING_WITH_USERS') {
      const questionToAdd = { label: 'Describe the testing and feedback for each testing type', conditional: true };
      flattenedQuestions.splice(4, 1, questionToAdd);
    }

    if (sectionId === 'REGULATIONS_AND_STANDARDS') {
      const questionToAdd = { label: 'Do you have a certification for each standard?', conditional: true };
      flattenedQuestions.splice(2, 1, questionToAdd);
    }

    return flattenedQuestions;
  }

  getIrSchemaSectionIdentificationV3(
    sectionId: string | null
  ): null | { group: { number: number; title: string }; section: { number: number; title: string } } {
    const schema = this.schema();
    const sectionGroup = schema.findIndex(s => s.subSections.find(sub => sub.id === sectionId));
    if (sectionGroup !== -1) {
      const section = schema[sectionGroup].subSections.findIndex(sub => sub.id === sectionId) ?? 0;
      return section === -1
        ? null
        : {
            group: { number: sectionGroup + 1, title: schema[sectionGroup].title },
            section: { number: section + 1, title: schema[sectionGroup].subSections[section].title }
          };
    } else {
      return null;
    }
  }

  getIrSchemaSectionV3(sectionId: string): {
    id: string;
    title: string;
    wizard: WizardIRV3EngineModel;
    evidences?: boolean;
  } {
    const irSchema = this.irSchemaInfo();
    const subsection = irSchema?.schema.sections.flatMap(s => s.subSections).find(sub => sub.id === sectionId);

    return {
      id: subsection?.id ?? '',
      title: subsection?.title ?? '',
      wizard: new WizardIRV3EngineModel({
        schema: irSchema,
        translations: this.getIrSchemaTranslationsMap(),
        sectionId: subsection?.id,
        steps: subsection!.steps.map(() => new FormEngineModelV3({ parameters: [] }))
      }),
      ...(sectionId === 'EVIDENCE_OF_EFFECTIVENESS' && { evidences: true })
    };
  }

  getIrSchemaNumberedSubSectionsList(): { value: string; label: string }[] {
    return this.schema().reduce((sectionGroupAcc: { value: string; label: string }[], sectionGroup, i) => {
      return [
        ...sectionGroupAcc,
        ...sectionGroup.subSections.reduce((sectionAcc: { value: string; label: string }[], section, j) => {
          return [...sectionAcc, ...[{ value: section.id, label: `${i + 1}.${j + 1} ${section.title}` }]];
        }, [])
      ];
    }, []);
  }

  getIrSchemaTranslationsMap(): IrSchemaTranslatorMapType {
    return irSchemaTranslationsMap(this.irSchemaInfo().schema);
  }

  getInnovationSectionsWithFiles(): string[] {
    return this.schema().flatMap(s => s.subSections.filter(ss => ss.hasFiles).map(s => s.id));
  }

  /**
   * Helper method to get the sections labels (group number and title) from a list of sections.
   */
  getGroupSectionsFromSubsections(subsections: string[], joinSeparator = '\n'): string {
    // Only interested in the main groups so removing duplicates for subsections
    return [
      ...new Set(
        subsections.map(s => {
          const section = this.getIrSchemaSectionIdentificationV3(s);
          return section ? `${section.group.number}. ${section.group.title}` : s;
        })
      )
    ]
      .sort()
      .join(joinSeparator);
  }
}
