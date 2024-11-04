import { Injectable, computed, signal } from '@angular/core';
import { Observable, Subject, debounceTime, map, filter, finalize, of, switchMap, take, tap } from 'rxjs';
import { isNil, omitBy, cloneDeep } from 'lodash';

import { AuthenticationModel } from '../../authentication/authentication.models';
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
import { InnovationRecordSchemaStore } from '../../innovation/innovation-record/innovation-record-schema/innovation-record-schema.store';
import { WizardEngineModel } from '@modules/shared/forms/engine/models/wizard-engine.models';
import { WizardIRV3EngineModel } from '@modules/shared/forms/engine/models/wizard-engine-irv3-schema.model';
import { INNOVATION_SECTIONS_EVIDENCES_WIZARD } from '../../innovation/innovation-record/202405/evidences-config';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable()
export class InnovationContextStore {
  // State
  private state = signal<{
    innovation: ContextInnovationType;
    isStateLoaded: boolean;
  }>({ innovation: EMPTY_CONTEXT, isStateLoaded: false });

  // Selectors
  info = computed(() => this.state().innovation);
  isArchived = computed(() => this.info().status === InnovationStatusEnum.ARCHIVED);
  isOwner = computed(() => this.info().loggedUser.isOwner);

  isStateLoaded = computed(() => this.state().isStateLoaded);
  isStateLoaded$ = toObservable(this.isStateLoaded);

  // Actions
  fetch$ = new Subject<{ innovationId: string; userContext: AuthenticationModel['userContext'] }>();

  constructor(
    private innovationService: InnovationContextService,
    private irSchemaStore: InnovationRecordSchemaStore
  ) {
    // Reducers
    this.fetch$
      .pipe(
        debounceTime(50),
        tap(() => {
          this.state.update(state => ({ ...state, isStateLoaded: false }));
        }),
        switchMap(ctx => this.innovationService.getContextInfo(ctx.innovationId, ctx.userContext))
      )
      .subscribe(innovation => {
        this.state.update(state => ({ ...state, innovation, isStateLoaded: true }));
      });

    // interval(60000).subscribe(() => this.logState('background refresh?'));
  }

  // Actions + Reducers
  update(info: DeepPartial<ContextInnovationType>): void {
    const dataToUpdate = omitBy<DeepPartial<ContextInnovationType>>(info, isNil);
    this.state.update(state => ({ ...state, innovation: { ...state.innovation, ...dataToUpdate } }));
  }

  clear(): void {
    this.state.update(() => ({ innovation: EMPTY_CONTEXT, isStateLoaded: false }));
  }
  // End Actions + Reducers

  getOrLoadInnovation$(
    innovationId: string,
    context: AuthenticationModel['userContext']
  ): Observable<ContextInnovationType> {
    const innovation = this.state().innovation;
    if (innovation && innovation.id === innovationId && Date.now() < innovation.expiryAt) {
      return of(innovation);
    }
    if (innovation.id !== innovationId) {
      this.clear();
    }

    this.fetch$.next({ innovationId, userContext: context });
    return this.isStateLoaded$.pipe(
      filter(() => this.isStateLoaded()),
      switchMap(() => of(this.state().innovation)),
      take(1)
    );
  }

  submitInnovation$(innovationId: string): Observable<{ id: string; status: InnovationStatusEnum }> {
    return this.innovationService.submitInnovation(innovationId).pipe(finalize(() => this.clear()));
  }

  getSectionsSummary$(innovationId: string): Observable<SectionsSummaryModel> {
    return this.innovationService.getInnovationSections(innovationId).pipe(
      map(response => {
        return this.irSchemaStore.getIrSchemaSectionsListV3().map(item => ({
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
    return this.irSchemaStore.getIrSchemaSectionV3(sectionId).wizard;
  }
}
