import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';

import { ActivatedRoute } from '@angular/router';
import { LocalStorageHelper, UtilsHelper } from '@app/base/helpers';
import {
  InnovationAssessmentListDTO,
  SupportSummaryOrganisationHistoryDTO,
  SupportSummaryOrganisationsListDTO,
  SupportSummarySectionType
} from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { OrganisationsListDTO, OrganisationsService } from '@modules/shared/services/organisations.service';
import { ContextInnovationType, InnovationStatusEnum } from '@modules/stores';
import { ObservableInput, forkJoin } from 'rxjs';
import { DateISOType } from '@app/base/types';
import { CustomNotificationEntrypointComponentLinksType } from '@modules/feature-modules/accessor/pages/innovation/custom-notifications/custom-notifications-entrypoint.component';
import { NotificationEnum } from '@modules/feature-modules/accessor/services/accessor.service';

type sectionsListType = {
  id: SupportSummarySectionType;
  title: string;
  unitsList: unitsListType[];
};

type unitsListType = SupportSummaryOrganisationsListDTO[SupportSummarySectionType][number] & {
  temporalDescription: string;
  historyList: SupportSummaryOrganisationHistoryDTO;
  isOpened: boolean;
  isLoading: boolean;
  canDoProgressUpdates: boolean;
};

type innovationAssessmentListType = InnovationAssessmentListDTO & {
  linkText: string;
};

const lsCacheId = 'page-innovations-support-summary-list::open-units';

@Component({
  selector: 'shared-pages-innovation-support-support-summary-list',
  templateUrl: './support-summary-list.component.html'
})
export class PageInnovationSupportSummaryListComponent extends CoreComponent implements OnInit {
  innovation: ContextInnovationType;
  lsCache: Set<string>;
  innovationAssessmentsList: innovationAssessmentListType[] = [];

  isSuggestionsListEmpty = true;
  showSuggestOrganisationsToSupportLink = false;

  sectionsList: sectionsListType[] = [
    { id: 'ENGAGING', title: 'Organisations currently supporting this innovation', unitsList: [] },
    { id: 'BEEN_ENGAGED', title: 'Organisations that have supported this innovation in the past', unitsList: [] },
    { id: 'SUGGESTED', title: 'Other suggested support organisations', unitsList: [] }
  ];

  customNotificationLinks: CustomNotificationEntrypointComponentLinksType[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private datePipe: DatePipe,
    private organisationsService: OrganisationsService
  ) {
    super();
    this.setPageTitle('Support summary');

    this.innovation = this.ctx.innovation.info();

    try {
      // Cache holds opened sections in the format ["sectionIndex,unitId", ...]
      this.lsCache = new Set(LocalStorageHelper.getObjectItem<string[]>(lsCacheId) ?? []);
    } catch (error) {
      this.lsCache = new Set([]);
    }

    if (this.ctx.user.isAdmin()) {
      this.setPageTitle('Support summary', { hint: `Innovation ${this.innovation.name}` });
    }
  }

  ngOnInit(): void {
    const subscriptions: {
      supportSummaryOrganisationsList: ObservableInput<SupportSummaryOrganisationsListDTO>;
      organisationsList?: ObservableInput<OrganisationsListDTO[]>;
      innovationAssessmentsObservable: ObservableInput<InnovationAssessmentListDTO[]>;
    } = {
      supportSummaryOrganisationsList: this.innovationsService.getSupportSummaryOrganisationsList(this.innovation.id),
      innovationAssessmentsObservable: this.innovationsService.getInnovationAssessmentsList(this.innovation.id)
    };

    if (this.ctx.user.isQualifyingAccessor()) {
      subscriptions.organisationsList = this.organisationsService.getOrganisationsList({ unitsInformation: true });
    }

    forkJoin(subscriptions).subscribe({
      next: results => {
        this.sectionsList[0].unitsList = results.supportSummaryOrganisationsList.ENGAGING.map(item => ({
          ...item,
          historyList: [],
          isLoading: false,
          isOpened: false,
          canDoProgressUpdates: this.canDoProgressUpdates(item.id, item.support?.minStart),
          temporalDescription: `Support period: ${this.datePipe.transform(item.support.start, 'MMMM y')} to present`
        }));
        this.sectionsList[1].unitsList = results.supportSummaryOrganisationsList.BEEN_ENGAGED.map(item => ({
          ...item,
          historyList: [],
          isLoading: false,
          isOpened: false,
          canDoProgressUpdates: this.canDoProgressUpdates(item.id, item.support?.minStart),
          temporalDescription: `Support period: ${this.datePipe.transform(
            item.support.start,
            'MMMM y'
          )} to ${this.datePipe.transform(item.support.end, 'MMMM y')}`
        }));
        this.sectionsList[2].unitsList = results.supportSummaryOrganisationsList.SUGGESTED.map(item => ({
          ...item,
          historyList: [],
          isLoading: false,
          isOpened: false,
          canDoProgressUpdates: this.canDoProgressUpdates(item.id, item.support?.minStart),
          temporalDescription: item.support.start
            ? `Date: ${this.datePipe.transform(item.support.start, 'MMMM y')}`
            : ''
        }));

        this.innovationAssessmentsList = results.innovationAssessmentsObservable.map(item => ({
          ...item,
          linkText: `${item.majorVersion > 1 ? 'Needs reassessment' : 'Needs assessment'} ${UtilsHelper.getAssessmentVersion(item.majorVersion, item.minorVersion)}`
        }));

        this.isSuggestionsListEmpty = !this.sectionsList.some(s => s.unitsList.length > 0);

        const queryUnitId = this.activatedRoute.snapshot.queryParams.unitId;

        // open the support summary entry specified in the query parameter
        for (const [listIndex, list] of this.sectionsList.entries()) {
          const unitIndex = list.unitsList.findIndex(unit => unit.id === queryUnitId);
          if (unitIndex !== -1) {
            this.onOpenCloseUnit(listIndex, unitIndex);
            break;
          }
        }

        this.lsCache.forEach(item => {
          const [sectionIndex, unitId] = item.split(',');

          const unitIndex = this.sectionsList[parseInt(sectionIndex)].unitsList.findIndex(
            i => i.id === unitId && i.id !== queryUnitId
          );
          if (unitIndex > -1) {
            this.onOpenCloseUnit(parseInt(sectionIndex), unitIndex);
          } else {
            this.lsCache.delete(`${sectionIndex},${unitId}`); // Removes outdated entry.
          }
        });

        LocalStorageHelper.setObjectItem(lsCacheId, Array.from(this.lsCache));

        // Check if there are organisations to be suggested by the qualifying accessor
        if (this.ctx.user.isQualifyingAccessor()) {
          const userUnitId = this.ctx.user.getUserContext()?.organisationUnit?.id ?? '';

          const engagingUnitsIds = this.sectionsList[1].unitsList.map(unit => unit.id);

          this.showSuggestOrganisationsToSupportLink =
            this.innovation.status === InnovationStatusEnum.IN_PROGRESS &&
            !!UtilsHelper.getAvailableOrganisationsToSuggest(
              this.innovation.id,
              userUnitId,
              results.organisationsList ?? [],
              engagingUnitsIds
            ).length;
        }

        this.customNotificationLinks = [
          {
            label: 'Notify me when an organisation updates their support status',
            action: NotificationEnum.SUPPORT_UPDATED
          },
          {
            label: 'Notify me when an organisation adds a progress update to this support summary',
            action: NotificationEnum.PROGRESS_UPDATE_CREATED
          }
        ];

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  onOpenCloseUnit(sectionsListIndex: number, unitsListIndex: number): void {
    const unitItem = this.sectionsList[sectionsListIndex].unitsList[unitsListIndex];
    unitItem.isOpened = !unitItem.isOpened;

    if (!unitItem.isOpened) {
      this.lsCache.delete(`${sectionsListIndex},${unitItem.id}`);
      LocalStorageHelper.setObjectItem(lsCacheId, Array.from(this.lsCache));
    } else {
      unitItem.isLoading = true;

      this.innovationsService
        .getSupportSummaryOrganisationHistory(this.innovation.id, unitItem.id)
        .subscribe({
          next: response => {
            unitItem.historyList = response;
            unitItem.isLoading = false;
            this.lsCache.add(`${sectionsListIndex},${unitItem.id}`);
          },
          error: () => {
            unitItem.isOpened = false;
            unitItem.isLoading = false;
            this.lsCache.delete(`${sectionsListIndex},${unitItem.id}`);
            this.setAlertError(
              'Unable to fetch organisation information. Please try again or contact us for further help'
            );
          }
        })
        .add(() => {
          LocalStorageHelper.setObjectItem(lsCacheId, Array.from(this.lsCache));
        });
    }
  }

  goToFragment(goToId: string) {
    const element = document.querySelector(`#${goToId}`);
    if (element) {
      element.scrollIntoView(true);
    }
  }

  canDoProgressUpdates(unitId: string, minStartSupport?: DateISOType) {
    if (!minStartSupport) {
      return false;
    }
    const minStart = new Date(minStartSupport).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);

    if (this.ctx.user.getUserContext()?.organisationUnit?.id === unitId && today >= minStart) {
      return true;
    } else {
      return false;
    }
  }
}
