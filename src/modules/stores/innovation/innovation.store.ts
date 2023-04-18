import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';

import { WizardEngineModel } from '@modules/shared/forms';
import { Store } from '../store.class';

import { InnovationService } from './innovation.service';

import { GetInnovationEvidenceDTO, InnovationModel, InnovationSectionInfoDTO, INNOVATION_SECTION_ACTION_STATUS, INNOVATION_SECTION_STATUS, INNOVATION_STATUS, INNOVATION_SUPPORT_STATUS, SectionsSummaryModel } from './innovation.models';
import { getInnovationRecordConfig } from './innovation-record/ir-versions.config';
import { InnovationSectionConfigType } from './innovation-record/ir-versions.types';


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

  submitInnovation$(innovationId: string): Observable<{ id: string, status: keyof typeof INNOVATION_STATUS }> {
    return this.innovationsService.submitInnovation(innovationId);
  }

  getSectionsSummary$(innovationId: string): Observable<SectionsSummaryModel> {

    return this.innovationsService.getInnovationSections(innovationId).pipe(
      map(response => getInnovationRecordConfig().map(item => ({
        title: item.title,
        sections: item.sections.map(ss => {
          const sectionState = response.find(a => a.section === ss.id) || {
            status: 'UNKNOWN',
            actionStatus: '',
            submittedAt: null,
            submittedBy: null,
            openActionsCount: 0
          };
          return {
            id: ss.id,
            title: ss.title,
            status: sectionState.status,
            isCompleted: INNOVATION_SECTION_STATUS[sectionState.status]?.isCompleteState || false,
            submittedAt: sectionState.submittedAt,
            submittedBy: sectionState.submittedBy === null ? null : {
              name: sectionState.submittedBy.name,
              isOwner: sectionState.submittedBy.isOwner
            },
            openActionsCount: sectionState.openActionsCount
          };
        })
      })))
    );

  }

  getSectionInfo$(innovationId: string, section: string): Observable<InnovationSectionInfoDTO> {
    return this.innovationsService.getSectionInfo(innovationId, section, { fields: ['actions'] });
  }

  updateSectionInfo$(innovationId: string, sectionKey: string, data: MappedObjectType): Observable<MappedObjectType> {
    return this.innovationsService.updateSectionInfo(innovationId, sectionKey, data);
  }

  submitSections$(innovationId: string, sectionKey: string): Observable<MappedObjectType> {
    return this.innovationsService.submitSections(innovationId, sectionKey);
  }

  getSectionEvidence$(innovationId: string, evidenceOffset: string): Observable<GetInnovationEvidenceDTO> {
    return this.innovationsService.getSectionEvidenceInfo(innovationId, evidenceOffset);
  }

  upsertSectionEvidenceInfo$(innovationId: string, data: MappedObjectType, evidenceId?: string): Observable<MappedObjectType> {
    return this.innovationsService.upsertSectionEvidenceInfo(innovationId, data, evidenceId);
  }

  deleteEvidence$(innovationId: string, evidenceId: string): Observable<boolean> {
    return this.innovationsService.deleteEvidence(innovationId, evidenceId);
  }


  getInnovationRecordSectionsTree(type: string, innovationId: string): { label: string, url: string, children: { label: string, url: string }[] }[] {

    return getInnovationRecordConfig().map((parentSection, i) => ({
      label: `${i + 1}. ${parentSection.title}`,
      url: `/${type}/innovations/${innovationId}/record/sections/${parentSection.sections[0].id}`,
      children: parentSection.sections.map((section, k) => ({
        label: `${i + 1}.${k + 1} ${section.title}`,
        url: `/${type}/innovations/${innovationId}/record/sections/${section.id}`
      }))
    }));

  }

  getInnovationRecordSection(sectionId: string, version?: string): InnovationSectionConfigType<string> {

    const section = cloneDeep(getInnovationRecordConfig(version)).find(sectionGroup => sectionGroup.sections.some(s => s.id === sectionId))?.sections.find(s => s.id === sectionId);

    if (!section) {
      throw new Error(`Innovation record section "${sectionId}" NOT FOUND`);
    }

    return section;

  }

  getInnovationRecordSectionWizard(sectionId: string, version?: string): WizardEngineModel {

    return this.getInnovationRecordSection(sectionId, version)?.wizard;

  }

  getInnovationRecordSectionIdentification(sectionId: string): { group: { number: number, title: string }, section: { number: number, title: string } } {

    const irConfig = getInnovationRecordConfig();

    const groupIndex = irConfig.findIndex(sectionGroup => sectionGroup.sections.some(section => section.id === sectionId));
    if (groupIndex === -1) { 
      // throw new Error(`Innovation record group NOT FOUND for section "${sectionId}"`); 
      return {
        group: { number: 0, title: '' },
        section: { number: 0, title: '' }
      };
    }

    const sectionIndex = irConfig[groupIndex].sections.findIndex(section => section.id === sectionId);
    if (sectionIndex === -1) { 
      // throw new Error(`Innovation record section "${sectionId}" NOT FOUND`); 
      return {
        group: { number: groupIndex + 1, title: irConfig[groupIndex]?.title ?? '' },
        section: { number: 0, title: '' }
      };
    }

    return {
      group: { number: groupIndex + 1, title: irConfig[groupIndex]?.title },
      section: { number: sectionIndex + 1, title: irConfig[groupIndex].sections[sectionIndex].title }
    };

  }

}
