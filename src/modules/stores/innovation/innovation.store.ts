import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Store } from '../store.class';

import { InnovationService } from './innovation.service';

import { InnovationModel, SectionsSummaryModel } from './innovation.models';
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
              const sectionState = response.find(a => a.code === ss.id);
              return { ...ss, ...{ status: sectionState?.status || 'UNKNOWN' as keyof typeof INNOVATION_SECTION_STATUS, actionStatus: sectionState?.actionStatus || '' as keyof typeof INNOVATION_SECTION_ACTION_STATUS } };
            })
          }));
        }),
        catchError(() =>  {
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





    // return new Observable((observer: Observer<SectionsSummaryModel[]>) => {

    //   this.innovationsService.getInnovationSections(innovationId).subscribe(
    //     response => {

    //       const toReturn = INNOVATION_SECTIONS.map(item => ({
    //         title: item.title,
    //         sections: item.sections.map(ss => {

    //           const sectionState = response.find(a => a.code === ss.id);

    //           return { ...ss, ...{ status: sectionState?.status || 'NOT_STARTED' as keyof typeof INNOVATION_SECTION_STATUS, actionStatus: sectionState?.actionStatus || '' as keyof typeof INNOVATION_SECTION_ACTION_STATUS } };
    //         })

    //       }));

    //       observer.next(toReturn);
    //       observer.complete();
    //     },
    //     () => {
    //       // this.setState(this.state);
    //       observer.error(false);
    //       observer.complete();
    //     }
    //   );

    // });

  }


}
