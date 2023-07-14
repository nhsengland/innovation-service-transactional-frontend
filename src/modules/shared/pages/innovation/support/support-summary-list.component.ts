import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { CoreComponent } from '@app/base';

import { ContextInnovationType } from '@modules/stores/context/context.types';
import { SupportSummaryOrganisationHistoryDTO, SupportSummaryOrganisationsListDTO, SupportSummarySectionType } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';


type sectionsListType = {
  id: SupportSummarySectionType,
  title: string,
  unitsList: unitsListType[]
}

type unitsListType = SupportSummaryOrganisationsListDTO[SupportSummarySectionType][number] & {
  temporalDescription: string,
  historyList: SupportSummaryOrganisationHistoryDTO,
  isOpened: boolean,
  isLoading: boolean
}


@Component({
  selector: 'shared-pages-innovation-support-support-summary-list',
  templateUrl: './support-summary-list.component.html'
})
export class PageInnovationSupportSummaryListComponent extends CoreComponent implements OnInit {

  innovation: ContextInnovationType;

  isAdmin: boolean;
  isInnovatorType: boolean;

  sectionsList: sectionsListType[] = [
    { id: 'ENGAGING', title: 'Organisations currently supporting this innovation', unitsList: [] },
    { id: 'BEEN_ENGAGED', title: 'Organisations that have supported this innovation in the past', unitsList: [] },
    { id: 'SUGGESTED', title: 'Suggested support organisations', unitsList: [] }
  ];

  constructor(
    private innovationsService: InnovationsService,
    private datePipe: DatePipe
  ) {

    super();
    this.setPageTitle('Support summary');
    this.setBackLink();

    this.innovation = this.stores.context.getInnovation();

    this.isAdmin = this.stores.authentication.isAdminRole();
    this.isInnovatorType = this.stores.authentication.isInnovatorType();

    if (this.isAdmin) {
      this.setPageTitle('Support summary', { hint: `Innovation ${this.innovation.name}` })
    }

  }


  ngOnInit(): void {

    this.innovationsService.getSupportSummaryOrganisationsList(this.innovation.id).subscribe({
      next: response => {

        this.sectionsList[0].unitsList = response.ENGAGING.map(item => ({
          ...item, historyList: [], isLoading: false, isOpened: false,
          temporalDescription: `Date: ${this.datePipe.transform(item.support.start, 'MMMM y')} to present`
        }));
        this.sectionsList[1].unitsList = response.BEEN_ENGAGED.map(item => ({
          ...item, historyList: [], isLoading: false, isOpened: false,
          temporalDescription: `Date: ${this.datePipe.transform(item.support.start, 'MMMM y')} to ${this.datePipe.transform(item.support.end, 'MMMM y')}`
        }));
        this.sectionsList[2].unitsList = response.SUGGESTED.map(item => ({
          ...item, historyList: [], isLoading: false, isOpened: false,
          temporalDescription: item.support.start ? `Date: ${this.datePipe.transform(item.support.start, 'MMMM y')}` : ''
        }));

        this.setPageStatus('READY');

      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });

  }

  onOpenCloseUnit(sectionsListIndex: number, unitsListIndex: number): void {

    let unitItem = this.sectionsList[sectionsListIndex].unitsList[unitsListIndex];
    unitItem.isOpened = !unitItem.isOpened;

    if (unitItem.isOpened) {

      unitItem.isLoading = true;

      this.innovationsService.getSupportSummaryOrganisationHistory(this.innovation.id, unitItem.id).subscribe({
        next: response => {
          unitItem.historyList = response;
          unitItem.isLoading = false;
        },
        error: () => {
          unitItem.isOpened = false;
          unitItem.isLoading = false;
          this.setAlertError('Unable to fetch organisation information. Please try again or contact us for further help');
        }
      });

    }

  }

  goToFragment(goToId: string) {
    const element = document.querySelector(`#${goToId}`);
    if (element) { element.scrollIntoView(true) };
  }

}
