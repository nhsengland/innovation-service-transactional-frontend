import { Component, Input, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { DateISOType } from '@app/base/types';
import { InnovationStatusEnum } from '@modules/stores/innovation';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { InnovationGroupedStatusEnum } from '@modules/stores/innovation/innovation.enums';

export type InnovationCardData = {
  id: string;
  name: string;
  status: InnovationStatusEnum;
  groupedStatus: InnovationGroupedStatusEnum;
  updatedAt: DateISOType;
  owner: string;
  countryName?: string | null;
  postCode: null | string;
  categories: string[];
  careSettings: string[];
  diseasesAndConditions: string[];
  keyHealthInequalities: string[];
  involvedAACProgrammes: string[];
  submittedAt: null | DateISOType;
  engagingUnits: string[];
  support: {
    status: InnovationSupportStatusEnum;
    updatedAt: DateISOType | null;
    closedReason: InnovationStatusEnum.ARCHIVED | 'STOPPED_SHARED' | InnovationSupportStatusEnum.CLOSED | null;
  } | null;
};

@Component({
  selector: 'theme-advanced-search-innovation-card',
  templateUrl: './innovation-advanced-search-card.component.html'
})
export class InnovationAdvancedSearchCardComponent extends CoreComponent implements OnInit {
  baseUrl: string;

  isAdminType: boolean;
  isAccessorType: boolean;

  isAccessorTypeAndArchivedInnovation: boolean = false;
  isAccessorTypeAndStoppedSharingInnovation: boolean = false;

  @Input({ required: true }) innovationCardData!: InnovationCardData;

  categoriesList: string = '';
  careSettingsList: string = '';
  diseasesAndConditionsList: string = '';
  keyHealthInequalitiesList: string = '';
  involvedAACProgrammesList: string = '';

  constructor() {
    super();

    this.baseUrl = `${this.stores.authentication.userUrlBasePath()}/innovations/`;

    this.isAdminType = this.stores.authentication.isAdminRole();
    this.isAccessorType = this.stores.authentication.isAccessorType();
  }
  ngOnInit(): void {
    this.isAccessorTypeAndArchivedInnovation =
      this.isAccessorType && this.innovationCardData.support?.closedReason === 'ARCHIVED';
    this.isAccessorTypeAndStoppedSharingInnovation =
      this.isAccessorType && this.innovationCardData.support?.closedReason === 'STOPPED_SHARED';
    this.categoriesList = this.getFormattedList(this.innovationCardData.categories);
    this.careSettingsList = this.getFormattedList(this.innovationCardData.careSettings);
    this.diseasesAndConditionsList = this.getFormattedList(this.innovationCardData.diseasesAndConditions);
    this.keyHealthInequalitiesList = this.getFormattedList(this.innovationCardData.keyHealthInequalities);
    this.involvedAACProgrammesList = this.getFormattedList(this.innovationCardData.involvedAACProgrammes);
  }

  private getFormattedList(list: string[]): string {
    return list.length > 0 ? list.join('. ') : 'None';
  }
}
