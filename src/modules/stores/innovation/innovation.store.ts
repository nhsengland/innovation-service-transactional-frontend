import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { Store } from '../store.class';
import { WizardEngineModel } from '@modules/shared/forms';

import { InnovationService } from './innovation.service';

import { InnovationModel, SectionsSummaryModel, InnovationSectionsIds, getInnovationInfoResponse, sectionType } from './innovation.models';
import { INNOVATION_STATUS, INNOVATION_SUPPORT_STATUS, INNOVATION_SECTION_STATUS, INNOVATION_SECTION_ACTION_STATUS } from './innovation.models';
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


  getInnovationInfo$(innovationId: string): Observable<getInnovationInfoResponse> {
    return this.innovationsService.getInnovationInfo(innovationId);
  }


  getSectionsSummary$(innovationId: string): Observable<SectionsSummaryModel[]> {

    return this.innovationsService.getInnovationSections(innovationId).pipe(
      map(response => {
        return INNOVATION_SECTIONS.map(item => ({
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
        }));
      }),
      catchError(() => {
        // this.logger.error('Unable to fetch sections information');
        return of(
          INNOVATION_SECTIONS.map(item => ({
            title: item.title,
            sections: item.sections.map(ss => {
              return {
                id: ss.id,
                title: ss.title,
                status: 'UNKNOWN' as keyof typeof INNOVATION_SECTION_STATUS,
                actionStatus: '' as keyof typeof INNOVATION_SECTION_ACTION_STATUS,
                isCompleted: false
              };
            })
          }))
        );
      })
    );

  }


  getSectionInfo$(innovationId: string, section: string): Observable<{ section: sectionType, data: MappedObject }> {

    return this.innovationsService.getSectionInfo(innovationId, section);

  }

  updateSectionInfo$(innovationId: string, section: string, isSubmission: boolean, data: MappedObject): Observable<MappedObject> {

    return this.innovationsService.updateSectionInfo(innovationId, section, isSubmission, data);

  }

  getSectionTitle(sectionId: InnovationSectionsIds): string {
    return INNOVATION_SECTIONS.find(sectionGroup => sectionGroup.sections.some(section => section.id === sectionId))?.sections.find(section => section.id === sectionId)?.title || '';
  }

  getSectionWizard(sectionId: InnovationSectionsIds): WizardEngineModel {
    return cloneDeep(
      INNOVATION_SECTIONS.find(sectionGroup => sectionGroup.sections.some(section => section.id === sectionId))?.sections.find(section => section.id === sectionId)?.wizard || new WizardEngineModel({})
    );
  }

}
