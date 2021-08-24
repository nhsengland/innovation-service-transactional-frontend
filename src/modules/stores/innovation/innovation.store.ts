/* istanbul ignore file */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { Store } from '../store.class';
import { EnvironmentStore } from '@modules/core/stores/environment.store';
import { WizardEngineModel } from '@modules/shared/forms';

import { InnovationService } from './innovation.service';

import {
  InnovationModel, SectionsSummaryModel, InnovationSectionsIds, sectionType, InnovationSectionConfigType, getInnovationEvidenceDTO,
  INNOVATION_STATUS, INNOVATION_SUPPORT_STATUS, INNOVATION_SECTION_STATUS, INNOVATION_SECTION_ACTION_STATUS, getInnovationCommentsDTO
} from './innovation.models';
import { INNOVATION_SECTIONS } from './innovation.config';
import { MappedObject } from '@modules/core/interfaces/base.interfaces';


@Injectable()
export class InnovationStore extends Store<InnovationModel> {

  constructor(
    private environmentStore: EnvironmentStore,
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

  getSectionsSummary$(module: '' | 'innovator' | 'accessor' | 'assessment', innovationId: string): Observable<{ innovation: { name: string, status: keyof typeof INNOVATION_STATUS }, sections: SectionsSummaryModel[] }> {

    return this.innovationsService.getInnovationSections(module, innovationId).pipe(
      map(response => ({
        innovation: {
          status: response.status,
          name: response.name
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
          innovation: { name: '', status: '' as any },
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

  getSectionInfo$(module: '' | 'innovator' | 'accessor' | 'assessment', innovationId: string, section: string): Observable<{ section: sectionType, data: MappedObject }> {
    return this.innovationsService.getSectionInfo(module, innovationId, section);
  }

  updateSectionInfo$(innovationId: string, section: string, data: MappedObject): Observable<MappedObject> {
    return this.innovationsService.updateSectionInfo(innovationId, section, data);
  }

  submitSections$(innovationId: string, sections: string[]): Observable<MappedObject> {
    return this.innovationsService.submitSections(innovationId, sections);
  }

  getSectionEvidence$(module: '' | 'innovator' | 'accessor' | 'assessment', innovationId: string, evidenceId: string): Observable<getInnovationEvidenceDTO> {
    return this.innovationsService.getSectionEvidenceInfo(module, innovationId, evidenceId);
  }

  upsertSectionEvidenceInfo$(innovationId: string, data: MappedObject, evidenceId?: string): Observable<MappedObject> {
    return this.innovationsService.upsertSectionEvidenceInfo(innovationId, data, evidenceId);
  }

  deleteEvidence$(innovationId: string, evidenceId: string): Observable<boolean> {
    return this.innovationsService.deleteEvidence(innovationId, evidenceId);
  }

  getSectionTitle(sectionId: InnovationSectionsIds): string {
    return INNOVATION_SECTIONS.find(sectionGroup => sectionGroup.sections.some(section => section.id === sectionId))?.sections.find(section => section.id === sectionId)?.title.toLowerCase() || '';
  }

  getSection(sectionId: InnovationSectionsIds): InnovationSectionConfigType['sections'][0] | undefined {
    return cloneDeep(INNOVATION_SECTIONS.find(sectionGroup => sectionGroup.sections.some(s => s.id === sectionId))?.sections.find(s => s.id === sectionId));
  }

  getSectionWizard(sectionId: InnovationSectionsIds): WizardEngineModel {

    const section = cloneDeep(
      INNOVATION_SECTIONS.find(sectionGroup => sectionGroup.sections.some(s => s.id === sectionId))?.sections.find(s => s.id === sectionId)?.wizard || new WizardEngineModel({})
    );

    this.updateSectionWizardDynamicInfo(section);

    return section;

  }


  updateSectionWizardDynamicInfo(section: WizardEngineModel): void {

    section.steps = section.steps.map(s => { // Transform needed information.

      switch (s.description) {
        case 'LINK_TO_ADVANCED_GUIDE_INTELLECTUAL_PROPERTY':
          s.description = `See <a href="${this.environmentStore.BASE_URL}/innovation-guides/advanced-innovation-guide" target="_blank" rel="noopener noreferrer"> Innovation guides (opens in new window) </a> for more information about intellectual property.`;
          break;
        case 'LINK_TO_ADVANCED_GUIDE_REGULATIONS_STANDARDS':
          s.description = `See <a href="${this.environmentStore.BASE_URL}/innovation-guides/advanced-innovation-guide" target="_blank" rel="noopener noreferrer"> Innovation guides (opens in new window) </a> for more information about regulations and standards.`;
          break;
        case 'LINK_TO_ADVANCED_GUIDE_COMPARATIVE_COST_BENEFIT':
          s.description = `See <a href="${this.environmentStore.BASE_URL}/innovation-guides/advanced-innovation-guide" target="_blank" rel="noopener noreferrer"> Innovation guides (opens in new window) </a> for more information about comparative cost benefit.`;
          break;
        case 'LINK_TO_ADVANCED_GUIDE_CREATING_REVENUE_MODEL':
          s.description = `See <a href="${this.environmentStore.BASE_URL}/innovation-guides/advanced-innovation-guide" target="_blank" rel="noopener noreferrer"> Innovation guides (opens in new window) </a> for more information about creating a revenue model.`;
          break;
        case 'LINK_TO_ADVANCED_GUIDE_IMPLEMENTATION_PLANS':
          s.description = `See <a href="${this.environmentStore.BASE_URL}/innovation-guides/advanced-innovation-guide" target="_blank" rel="noopener noreferrer"> Innovation guides (opens in new window) </a> for more information about implementation plans.`;
          break;
        default:
          break;
      }

      return s;

    });

  }


  // Innovation comments methods.
  getInnovationComments$(module: '' | 'innovator' | 'accessor', innovationId: string, createdOrder: 'asc' | 'desc'): Observable<getInnovationCommentsDTO[]> {
    return this.innovationsService.getInnovationComments(module, innovationId, createdOrder);
  }

  createInnovationComment$(module: '' | 'innovator' | 'accessor', innovationId: string, body: { comment: string, replyTo?: string }): Observable<{ id: string }> {
    return this.innovationsService.createInnovationComment(module, innovationId, body);
  }

}
