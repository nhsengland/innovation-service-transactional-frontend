import { Injectable, computed, signal } from '@angular/core';
import {
  Observable,
  Subject,
  debounceTime,
  map,
  filter,
  finalize,
  of,
  switchMap,
  tap,
  combineLatest,
  throwError,
  take,
  catchError
} from 'rxjs';
import { omitBy, cloneDeep, isUndefined } from 'lodash';

import { InnovationContextService } from './innovation-context.service';
import { InnovationSectionStatusEnum, InnovationStatusEnum } from './innovation.enums';
import { ContextInnovationType, EMPTY_CONTEXT } from './innovation-context.types';
import { DeepPartial, MappedObjectType } from '@app/base/types';
import {
  GetInnovationEvidenceDTO,
  InnovationAllSectionsInfoDTO,
  InnovationSectionInfoDTO,
  SectionsSummaryModel
} from './innovation.models';
import { WizardEngineModel } from '@modules/shared/forms/engine/models/wizard-engine.models';
import { WizardIRV3EngineModel } from '@modules/shared/forms/engine/models/wizard-engine-irv3-schema.model';
import { INNOVATION_SECTIONS_EVIDENCES_WIZARD } from '../../innovation/innovation-record/202405/evidences-config';
import { toObservable } from '@angular/core/rxjs-interop';
import { SchemaContextStore } from '../schema/schema.store';
import { HttpErrorResponse } from '@angular/common/http';
import { UserContextType } from '../user/user.types';

@Injectable()
export class InnovationContextStore {
  // State
  private state = signal<{
    innovation: ContextInnovationType;
    isStateLoaded: boolean;
    error?: HttpErrorResponse;
  }>({ innovation: EMPTY_CONTEXT, isStateLoaded: false });

  // Selectors
  info = computed(() => this.state().innovation);
  isArchived = computed(() => this.info().status === InnovationStatusEnum.ARCHIVED);
  isOwner = computed(() => this.info().loggedUser.isOwner);

  isStateLoaded = computed(() => this.state().isStateLoaded);
  isStateLoaded$ = toObservable(this.isStateLoaded);
  hasError = computed(() => this.state().error);
  hasError$ = toObservable(this.hasError);

  // Actions
  fetch$ = new Subject<{ innovationId: string; userContext: UserContextType['domainContext'] }>();

  constructor(
    private innovationService: InnovationContextService,
    private schemaStore: SchemaContextStore
  ) {
    // Reducers
    this.fetch$
      .pipe(
        debounceTime(50),
        tap(() => {
          this.state.update(state => ({ ...state, isStateLoaded: false, error: undefined }));
        }),
        switchMap(ctx =>
          this.innovationService.getContextInfo(ctx.innovationId, ctx.userContext).pipe(
            catchError(error => {
              this.state.update(state => ({ ...state, error }));
              return of(null);
            })
          )
        )
      )
      .subscribe(innovation => {
        if (innovation) {
          this.state.update(state => ({ ...state, innovation, isStateLoaded: true }));
        }
      });
  }

  // Actions + Reducers
  update(info: DeepPartial<ContextInnovationType>): void {
    const dataToUpdate = omitBy<DeepPartial<ContextInnovationType>>(info, isUndefined);
    this.state.update(state => ({ ...state, innovation: { ...state.innovation, ...dataToUpdate } }));
  }

  clear(): void {
    this.state.update(() => ({ innovation: EMPTY_CONTEXT, isStateLoaded: false, error: undefined }));
  }
  // End Actions + Reducers

  getOrLoadInnovation$(
    innovationId: string,
    context: UserContextType['domainContext']
  ): Observable<ContextInnovationType> {
    const innovation = this.state().innovation;
    if (innovation && innovation.id === innovationId && Date.now() < innovation.expiryAt) {
      return of(innovation);
    }
    if (innovation.id !== innovationId || this.hasError()) {
      this.clear();
    }

    this.fetch$.next({ innovationId, userContext: context });
    return combineLatest([this.isStateLoaded$, this.hasError$]).pipe(
      filter(() => this.isStateLoaded() || this.hasError() !== undefined),
      switchMap(() => {
        if (this.hasError()) {
          return throwError(() => this.hasError());
        }
        return of(this.state().innovation);
      }),
      take(1)
    );
  }

  submitInnovation$(innovationId: string): Observable<{ id: string; status: InnovationStatusEnum }> {
    return this.innovationService.submitInnovation(innovationId).pipe(finalize(() => this.clear()));
  }

  getSectionsSummary$(innovationId: string): Observable<SectionsSummaryModel> {
    return this.innovationService.getInnovationSections(innovationId).pipe(
      map(response => {
        return this.schemaStore.getSectionsList().map(item => ({
          id: item.id,
          title: item.title,
          sections: item.sections.map(ss => {
            const sectionState = response.find(a => a.section === ss.id) || {
              status: InnovationSectionStatusEnum.NOT_STARTED,
              actionStatus: '',
              submittedAt: null,
              submittedBy: null,
              openTasksCount: 0
            };
            return {
              id: ss.id,
              title: ss.title,
              status: sectionState.status,
              isCompleted: sectionState.status === InnovationSectionStatusEnum.SUBMITTED,
              submittedAt: sectionState.submittedAt,
              submittedBy:
                sectionState.submittedBy === null
                  ? null
                  : {
                      name: sectionState.submittedBy.name,
                      isOwner: sectionState.submittedBy.isOwner
                    },
              openTasksCount: sectionState.openTasksCount
            };
          })
        }));
      })
    );
  }

  getSectionInfo$(innovationId: string, section: string): Observable<InnovationSectionInfoDTO> {
    return this.innovationService.getSectionInfo(innovationId, section, { fields: ['tasks'] });
  }

  getAllSectionsInfo$(innovationId: string): Observable<InnovationAllSectionsInfoDTO> {
    return this.innovationService.getAllSectionsInfo(innovationId);
  }

  updateSectionInfo$(innovationId: string, sectionKey: string, data: MappedObjectType): Observable<MappedObjectType> {
    return this.innovationService.updateSectionInfo(innovationId, sectionKey, data);
  }

  submitSections$(innovationId: string, sectionKey: string): Observable<MappedObjectType> {
    return this.innovationService.submitSections(innovationId, sectionKey);
  }

  getSectionEvidence$(innovationId: string, evidenceId: string): Observable<GetInnovationEvidenceDTO> {
    return this.innovationService.getSectionEvidenceInfo(innovationId, evidenceId);
  }

  upsertSectionEvidenceInfo$(
    innovationId: string,
    data: MappedObjectType,
    evidenceId?: string
  ): Observable<{ id: string }> {
    return this.innovationService.upsertSectionEvidenceInfo(innovationId, data, evidenceId);
  }

  deleteEvidence$(innovationId: string, evidenceId: string): Observable<void> {
    return this.innovationService.deleteEvidence(innovationId, evidenceId);
  }

  // TODO: Move this to schema store.
  getInnovationRecordSectionEvidencesWizard(sectionId: string): WizardEngineModel {
    const section = cloneDeep(INNOVATION_SECTIONS_EVIDENCES_WIZARD.find(section => section.id === sectionId)?.wizard);

    if (!section) {
      throw new Error(`Innovation record section "${sectionId}" NOT FOUND`);
    }

    return section;
  }

  // TODO: Move this to schema store
  getInnovationRecordSectionWizard(sectionId: string, version?: string): WizardIRV3EngineModel {
    return this.schemaStore.getIrSchemaSectionV3(sectionId).wizard;
  }
}
