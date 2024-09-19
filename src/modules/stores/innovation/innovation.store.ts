import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';

import { Store } from '../store.class';

import { InnovationService } from './innovation.service';

import {
  GetInnovationEvidenceDTO,
  INNOVATION_SECTION_STATUS,
  INNOVATION_STATUS,
  INNOVATION_SUPPORT_STATUS,
  InnovationAllSectionsInfoDTO,
  InnovationModel,
  InnovationSectionInfoDTO,
  SectionsSummaryModel
} from './innovation.models';

import { WizardIRV3EngineModel } from '@modules/shared/forms/engine/models/wizard-engine-irv3-schema.model';
import { InnovationRecordSchemaStore } from './innovation-record/innovation-record-schema/innovation-record-schema.store';
import { INNOVATION_SECTIONS_EVIDENCES_WIZARD } from './innovation-record/202405/evidences-config';
import { WizardEngineModel } from '@app/base/forms';

@Injectable()
export class InnovationStore extends Store<InnovationModel> {
  constructor(
    private innovationsService: InnovationService,
    private irSchemaStore: InnovationRecordSchemaStore
  ) {
    super('store::innovations', new InnovationModel());
  }

  get INNOVATION_STATUS(): typeof INNOVATION_STATUS {
    return INNOVATION_STATUS;
  }
  get INNOVATION_SUPPORT_STATUS(): typeof INNOVATION_SUPPORT_STATUS {
    return INNOVATION_SUPPORT_STATUS;
  }
  get INNOVATION_SECTION_STATUS(): typeof INNOVATION_SECTION_STATUS {
    return INNOVATION_SECTION_STATUS;
  }

  isAssessmentStatus(status: keyof typeof INNOVATION_STATUS | string): boolean {
    return ['WAITING_NEEDS_ASSESSMENT', 'NEEDS_ASSESSMENT'].includes(status);
  }

  submitInnovation$(innovationId: string): Observable<{ id: string; status: keyof typeof INNOVATION_STATUS }> {
    return this.innovationsService.submitInnovation(innovationId);
  }

  getSectionsSummary$(innovationId: string): Observable<SectionsSummaryModel> {
    return this.innovationsService.getInnovationSections(innovationId).pipe(
      map(response => {
        return this.irSchemaStore.getIrSchemaSectionsListV3().map(item => ({
          id: item.id,
          title: item.title,
          sections: item.sections.map(ss => {
            const sectionState = response.find(a => a.section === ss.id) || {
              status: 'UNKNOWN',
              actionStatus: '',
              submittedAt: null,
              submittedBy: null,
              openTasksCount: 0
            };
            return {
              id: ss.id,
              title: ss.title,
              status: sectionState.status,
              isCompleted: INNOVATION_SECTION_STATUS[sectionState.status]?.isCompleteState || false,
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
    return this.innovationsService.getSectionInfo(innovationId, section, { fields: ['tasks'] });
  }

  getAllSectionsInfo$(innovationId: string): Observable<InnovationAllSectionsInfoDTO> {
    return this.innovationsService.getAllSectionsInfo(innovationId);
  }

  updateSectionInfo$(innovationId: string, sectionKey: string, data: MappedObjectType): Observable<MappedObjectType> {
    return this.innovationsService.updateSectionInfo(innovationId, sectionKey, data);
  }

  submitSections$(innovationId: string, sectionKey: string): Observable<MappedObjectType> {
    return this.innovationsService.submitSections(innovationId, sectionKey);
  }

  getSectionEvidence$(innovationId: string, evidenceId: string): Observable<GetInnovationEvidenceDTO> {
    return this.innovationsService.getSectionEvidenceInfo(innovationId, evidenceId);
  }

  upsertSectionEvidenceInfo$(
    innovationId: string,
    data: MappedObjectType,
    evidenceId?: string
  ): Observable<{ id: string }> {
    return this.innovationsService.upsertSectionEvidenceInfo(innovationId, data, evidenceId);
  }

  deleteEvidence$(innovationId: string, evidenceId: string): Observable<void> {
    return this.innovationsService.deleteEvidence(innovationId, evidenceId);
  }

  getInnovationRecordSectionEvidencesWizard(sectionId: string): WizardEngineModel {
    const section = INNOVATION_SECTIONS_EVIDENCES_WIZARD.find(section => section.id === sectionId)?.wizard;

    if (!section) {
      throw new Error(`Innovation record section "${sectionId}" NOT FOUND`);
    }

    return section;
  }

  getInnovationRecordSectionWizard(sectionId: string, version?: string): WizardIRV3EngineModel {
    return this.irSchemaStore.getIrSchemaSectionV3(sectionId).wizard;
  }
}
