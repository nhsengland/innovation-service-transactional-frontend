/* istanbul ignore file */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import { APIQueryParamsType } from '@modules/core/models/table.model';

import { Store } from '../store.class';
import { WizardEngineModel } from '@modules/shared/forms';

import { InnovationService, ActivityLogOutDTO, } from './innovation.service';

import { INNOVATION_SECTIONS, getSectionTitle } from './innovation.config';
import { ActivityLogTypesEnum, InnovationSectionEnum } from './innovation.enums';
import {
  InnovationModel,
  sectionType,
  INNOVATION_STATUS, INNOVATION_SUPPORT_STATUS, INNOVATION_SECTION_STATUS, INNOVATION_SECTION_ACTION_STATUS,
  SectionsSummaryModel, InnovationSectionConfigType,
  getInnovationEvidenceDTO, getInnovationCommentsDTO
} from './innovation.models';


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

  submitInnovation$(innovationId: string): Observable<{ id: string, status: keyof typeof INNOVATION_STATUS }> {
    return this.innovationsService.submitInnovation(innovationId);
  }

  getActivityLog$(
    innovationId: string,
    queryParams: APIQueryParamsType<{ activityTypes: ActivityLogTypesEnum[], startDate: string, endDate: string }>
  ): Observable<ActivityLogOutDTO> {
    return this.innovationsService.getInnovationActivityLog(innovationId, queryParams);
  }

  getSectionsSummary$(innovationId: string): Observable<{ innovation: { name: string, status: keyof typeof INNOVATION_STATUS }, sections: SectionsSummaryModel[] }> {

    return this.innovationsService.getInnovationSections(innovationId).pipe(
      map(response => ({
        innovation: {
          status: response.status,
          name: response.name
        },
        sections: INNOVATION_SECTIONS.map(item => ({
          title: item.title,
          sections: item.sections.map(ss => {
            const sectionState = response.sections.find(a => a.section === ss.id) || { status: 'UNKNOWN', actionStatus: '', actionCount: 0 };
            return {
              id: ss.id,
              title: ss.title,
              status: sectionState.status,
              isCompleted: INNOVATION_SECTION_STATUS[sectionState.status]?.isCompleteState || false,
              actionCount: sectionState.actionCount
            };
          })
        }))
      })),
      catchError(() => {
        // this.logger.error('Unable to fetch sections information');
        return of({
          innovation: { name: '', status: '' as any },
          sections: INNOVATION_SECTIONS.map(item => ({
            title: item.title,
            sections: item.sections.map(ss => ({
              id: ss.id,
              title: ss.title,
              status: 'UNKNOWN' as keyof typeof INNOVATION_SECTION_STATUS,
              actionStatus: '' as keyof typeof INNOVATION_SECTION_ACTION_STATUS,
              isCompleted: false,
              actionCount: 0
            }))
          }))
        });
      })
    );

  }

  getSectionInfo$(innovationId: string, section: string): Observable<{ section: sectionType, data: MappedObjectType }> {
    return this.innovationsService.getSectionInfo(innovationId, section);
  }

  updateSectionInfo$(innovationId: string, section: string, data: MappedObjectType): Observable<MappedObjectType> {
    return this.innovationsService.updateSectionInfo(innovationId, section, data);
  }

  submitSections$(innovationId: string, sections: string[]): Observable<MappedObjectType> {
    return this.innovationsService.submitSections(innovationId, sections);
  }

  getSectionEvidence$(innovationId: string, evidenceId: string): Observable<getInnovationEvidenceDTO> {
    return this.innovationsService.getSectionEvidenceInfo(innovationId, evidenceId);
  }

  upsertSectionEvidenceInfo$(innovationId: string, data: MappedObjectType, evidenceId?: string): Observable<MappedObjectType> {
    return this.innovationsService.upsertSectionEvidenceInfo(innovationId, data, evidenceId);
  }

  deleteEvidence$(innovationId: string, evidenceId: string): Observable<boolean> {
    return this.innovationsService.deleteEvidence(innovationId, evidenceId);
  }

  getSectionTitle(sectionId: InnovationSectionEnum): string {
    return getSectionTitle(sectionId);
  }

  getSection(sectionId: InnovationSectionEnum): InnovationSectionConfigType['sections'][0] | undefined {
    return cloneDeep(INNOVATION_SECTIONS.find(sectionGroup => sectionGroup.sections.some(s => s.id === sectionId))?.sections.find(s => s.id === sectionId));
  }

  getSectionWizard(sectionId: InnovationSectionEnum): WizardEngineModel {
    return cloneDeep(
      INNOVATION_SECTIONS.find(sectionGroup => sectionGroup.sections.some(s => s.id === sectionId))?.sections.find(s => s.id === sectionId)?.wizard || new WizardEngineModel({})
    );
  }


  // Innovation comments methods.
  getInnovationComments$(innovationId: string, createdOrder: 'asc' | 'desc'): Observable<getInnovationCommentsDTO[]> {
    return this.innovationsService.getInnovationComments(innovationId, createdOrder);
  }

  createInnovationComment$( innovationId: string, body: { comment: string, replyTo?: string }): Observable<{ id: string }> {
    return this.innovationsService.createInnovationComment(innovationId, body);
  }

  updateInnovationComment$( innovationId: string, body: { comment: string, replyTo?: string }, commentId: string): Observable<{ id: string }> {
    return this.innovationsService.updateInnovationComment(innovationId, body, commentId);
  }

}
