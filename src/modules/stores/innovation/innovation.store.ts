/* istanbul ignore file */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { Store } from '../store.class';
import { WizardEngineModel } from '@modules/shared/forms';

import { InnovationService } from './innovation.service';

import {
  InnovationModel, SectionsSummaryModel, InnovationSectionsIds, sectionType, InnovationSectionConfigType, getInnovationEvidenceDTO,
  INNOVATION_STATUS, INNOVATION_SUPPORT_STATUS, INNOVATION_SECTION_STATUS, INNOVATION_SECTION_ACTION_STATUS
} from './innovation.models';
import { INNOVATION_SECTIONS } from './innovation.config';
import { MappedObject } from '@modules/core/interfaces/base.interfaces';


@Injectable()
export class InnovationStore extends Store<InnovationModel> {

  constructor(
    private innovationsService: InnovationService
  ) {
    super('store::innovations', new InnovationModel());
  }

  get INNOVATION_STATUS(): typeof INNOVATION_STATUS { return INNOVATION_STATUS; }
  get INNOVATION_SUPPORT_STATUS(): typeof INNOVATION_SUPPORT_STATUS { return INNOVATION_SUPPORT_STATUS; }
  get INNOVATION_SECTION_STATUS(): typeof INNOVATION_SECTION_STATUS { return INNOVATION_SECTION_STATUS; }
  get INNOVATION_SECTION_ACTION_STATUS(): typeof INNOVATION_SECTION_ACTION_STATUS { return INNOVATION_SECTION_ACTION_STATUS; }

  isAssessmentStatus(status: keyof typeof INNOVATION_STATUS | string): boolean {
    return ['WAITING_NEEDS_ASSESSMENT', 'NEEDS_ASSESSMENT'].includes(status);
  }

  // getInnovationInfo$(innovationId: string): Observable<getInnovationInfoResponse> {
  //   return this.innovationsService.getInnovationInfo(innovationId);
  // }

  submitInnovation$(innovationId: string): Observable<{id: string, status: keyof typeof INNOVATION_STATUS}> {
    return this.innovationsService.submitInnovation(innovationId);
  }


  getSectionsSummary$(module: '' | 'innovator' | 'accessor', innovationId: string): Observable<{ innovation: { status: keyof typeof INNOVATION_STATUS }, sections: SectionsSummaryModel[] }> {

    return this.innovationsService.getInnovationSections(module, innovationId).pipe(
      map(response => ({
        innovation: {
          status: response.status
        },
        sections: INNOVATION_SECTIONS.map(item => ({
          title: item.title,
          sections: item.sections.map(ss => {
            const sectionState = response.sections.find(a => a.section === ss.id) || { status: 'UNKNOWN', actionStatus: '' };
            return {
              id: ss.id,
              title: ss.title,
              status: sectionState.status,
              actionStatus: sectionState.actionStatus,
              isCompleted: INNOVATION_SECTION_STATUS[sectionState.status]?.isCompleteState || false
            };
          })
        }))
      })),
      catchError(() => {
        // this.logger.error('Unable to fetch sections information');
        return of({
          innovation: { status: '' as any },
          sections: INNOVATION_SECTIONS.map(item => ({
            title: item.title,
            sections: item.sections.map(ss => ({
              id: ss.id,
              title: ss.title,
              status: 'UNKNOWN' as keyof typeof INNOVATION_SECTION_STATUS,
              actionStatus: '' as keyof typeof INNOVATION_SECTION_ACTION_STATUS,
              isCompleted: false
            }))
          }))
        });
      })
    );

  }


  getSectionInfo$(module: '' | 'innovator' | 'accessor', innovationId: string, section: string): Observable<{ section: sectionType, data: MappedObject }> {
    return this.innovationsService.getSectionInfo(module, innovationId, section);
  }

  updateSectionInfo$(innovationId: string, section: string, data: MappedObject): Observable<MappedObject> {
    return this.innovationsService.updateSectionInfo(innovationId, section, data);
  }

  submitSections$(innovationId: string, sections: string[]): Observable<MappedObject> {
    return this.innovationsService.submitSections(innovationId, sections);
  }

  getSectionEvidence$(module: '' | 'innovator' | 'accessor', innovationId: string, evidenceId: string): Observable<getInnovationEvidenceDTO> {
    return this.innovationsService.getSectionEvidenceInfo(module, innovationId, evidenceId);
  }

  upsertSectionEvidenceInfo$(innovationId: string, data: MappedObject, evidenceId?: string): Observable<MappedObject> {
    return this.innovationsService.upsertSectionEvidenceInfo(innovationId, data, evidenceId);
  }

  deleteEvidence$(innovationId: string, evidenceId: string): Observable<boolean> {
    return this.innovationsService.deleteEvidence(innovationId, evidenceId);
  }


  getSectionTitle(sectionId: InnovationSectionsIds): string {
    return INNOVATION_SECTIONS.find(sectionGroup => sectionGroup.sections.some(section => section.id === sectionId))?.sections.find(section => section.id === sectionId)?.title || '';
  }


  getSection(sectionId: InnovationSectionsIds): InnovationSectionConfigType['sections'][0] | undefined {
    return cloneDeep(INNOVATION_SECTIONS.find(sectionGroup => sectionGroup.sections.some(s => s.id === sectionId))?.sections.find(s => s.id === sectionId));
  }

  getSectionWizard(sectionId: InnovationSectionsIds): WizardEngineModel {
    return cloneDeep(
      INNOVATION_SECTIONS.find(sectionGroup => sectionGroup.sections.some(s => s.id === sectionId))?.sections.find(s => s.id === sectionId)?.wizard || new WizardEngineModel({})
    );
  }

}
