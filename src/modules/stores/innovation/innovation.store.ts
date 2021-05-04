import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Store } from '../store.class';
import { FormEngineModel, WizardEngineModel } from '@modules/shared/forms';

import { InnovationService } from './innovation.service';

import { InnovationModel, SectionsSummaryModel, InnovationSectionsIds } from './innovation.models';
import { INNOVATION_STATUS, INNOVATION_SUPPORT_STATUS, INNOVATION_SECTION_STATUS, INNOVATION_SECTION_ACTION_STATUS } from './innovation.models';
import { INNOVATION_SECTIONS } from './innovation.config';


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


  getSectionsSummary$(innovationId: string): Observable<SectionsSummaryModel[]> {

    return this.innovationsService.getInnovationSections(innovationId).pipe(
      map(response => {
        return INNOVATION_SECTIONS.map(item => ({
          title: item.title,
          sections: item.sections.map(ss => {
            const sectionState = response.sections.find(a => a.section === ss.id) || { status: 'UNKNOWN', actionStatus: '' };
            return { ...ss, ...{ status: sectionState.status, actionStatus: sectionState.actionStatus } };
          })
        }));
      }),
      catchError(() => {
        // this.logger.error('Unable to fetch sections information');
        return of(
          INNOVATION_SECTIONS.map(item => ({
            title: item.title,
            sections: item.sections.map(ss => {
              return { ...ss, ...{ status: 'UNKNOWN' as keyof typeof INNOVATION_SECTION_STATUS, actionStatus: '' as keyof typeof INNOVATION_SECTION_ACTION_STATUS } };
            })
          }))
        );
      })
    );

  }


  getSectionForm(sectionId: InnovationSectionsIds): FormEngineModel[] {
    return INNOVATION_SECTIONS.find(sectionGroup => sectionGroup.sections.some(section => section.id === sectionId))?.sections.find(section => section.id = sectionId)?.wizard.steps || [];
  }

  getSectionWizard(sectionId: InnovationSectionsIds): WizardEngineModel {
    return INNOVATION_SECTIONS.find(sectionGroup => sectionGroup.sections.some(section => section.id === sectionId))?.sections.find(section => section.id = sectionId)?.wizard || new WizardEngineModel({});
  }



}
