import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';

import { ActivatedRoute } from '@angular/router';
import { NotificationContextDetailEnum } from '@app/base/enums';
import { LocalStorageHelper, UtilsHelper } from '@app/base/helpers';
import {
  InnovationAssessmentListDTO,
  SupportSummaryOrganisationHistoryDTO,
  SupportSummaryOrganisationsListDTO,
  SupportSummarySectionType
} from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { OrganisationsListDTO, OrganisationsService } from '@modules/shared/services/organisations.service';
import { ContextInnovationType } from '@modules/stores/context/context.types';
import { InnovationStatusEnum, InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { ObservableInput, forkJoin } from 'rxjs';
import { DateISOType } from '@app/base/types';

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

  // Flags
  isQualifyingAccessorRole: boolean;
  isAdmin: boolean;
  isInnovatorType: boolean;
  isAccessorType: boolean;

  isSuggestionsListEmpty: boolean = true;
  showSuggestOrganisationsToSupportLink: boolean = false;

  sectionsList: sectionsListType[] = [
    { id: 'ENGAGING', title: 'Organisations currently supporting this innovation', unitsList: [] },
    { id: 'BEEN_ENGAGED', title: 'Organisations that have supported this innovation in the past', unitsList: [] },
    { id: 'SUGGESTED', title: 'Other suggested support organisations', unitsList: [] }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private datePipe: DatePipe,
    private organisationsService: OrganisationsService
  ) {
    super();
    this.setPageTitle('Support summary');

    this.innovation = this.stores.context.getInnovation();

    try {
      // Cache holds opened sections in the format ["sectionIndex,unitId", ...]
      this.lsCache = new Set(LocalStorageHelper.getObjectItem<string[]>(lsCacheId) ?? []);
    } catch (error) {
      this.lsCache = new Set([]);
    }

    this.isAdmin = this.stores.authentication.isAdminRole();
    this.isInnovatorType = this.stores.authentication.isInnovatorType();
    this.isQualifyingAccessorRole = this.stores.authentication.isQualifyingAccessorRole();
    this.isAccessorType = this.stores.authentication.isAccessorType();

    if (this.isAdmin) {
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

    if (this.isQualifyingAccessorRole) {
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
        if (this.isQualifyingAccessorRole) {
          const userUnitId = this.stores.authentication.getUserContextInfo()?.organisationUnit?.id ?? '';

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

        // Throw notification read dismiss.
        if (this.isAccessorType) {
          this.stores.context.dismissNotification(this.innovation.id, {
            contextDetails: [
              NotificationContextDetailEnum.SUPPORT_UPDATED,
              NotificationContextDetailEnum.PROGRESS_UPDATE_CREATED,
              NotificationContextDetailEnum.SUGGESTED_SUPPORT_UPDATED
            ]
          });
        }

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

            // Throw notification read dismiss.
            if (unitItem.support?.id) {
              if (this.isInnovatorType) {
                this.stores.context.dismissNotification(this.innovation.id, {
                  contextDetails: [
                    NotificationContextDetailEnum.ST02_SUPPORT_STATUS_TO_OTHER,
                    NotificationContextDetailEnum.ST03_SUPPORT_STATUS_TO_WAITING,
                    NotificationContextDetailEnum.SS01_SUPPORT_SUMMARY_UPDATE_TO_INNOVATORS
                  ],
                  contextIds: [unitItem.support.id]
                });
              } else if (this.isAccessorType) {
                this.stores.context.dismissNotification(this.innovation.id, {
                  contextDetails: [
                    NotificationContextDetailEnum.SS02_SUPPORT_SUMMARY_UPDATE_TO_OTHER_ENGAGING_ACCESSORS,
                    NotificationContextDetailEnum.AU02_ACCESSOR_IDLE_ENGAGING_SUPPORT
                  ],
                  contextIds: [unitItem.support.id]
                });
              }
            }
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

    if (this.stores.authentication.getUserContextInfo()?.organisationUnit?.id === unitId && today >= minStart) {
      return true;
    } else {
      return false;
    }
  }
}
