import { Component, Input, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { DateISOType } from '@app/base/types';

export type InnovationCardData = {
  id: string;
  name: string;
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
  supportStatus: {
    status: string;
    updatedAt: DateISOType;
  };
  innovationStatus: {
    status: string;
    updatedAt: DateISOType;
  };
};

@Component({
  selector: 'theme-advanced-search-innovation-card',
  templateUrl: './innovation-advanced-search-card.component.html'
})
export class InnovationAdvancedSearchCardComponent extends CoreComponent implements OnInit {
  baseUrl: string;

  isAdminType: boolean;
  isAccessorType: boolean;

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
    this.categoriesList = this.getFormattedList(this.innovationCardData.categories);
    this.careSettingsList = this.getFormattedList(this.innovationCardData.careSettings);
    this.diseasesAndConditionsList = this.getFormattedList(this.innovationCardData.diseasesAndConditions);
    this.keyHealthInequalitiesList = this.getFormattedList(this.innovationCardData.keyHealthInequalities);
    this.involvedAACProgrammesList = this.getFormattedList(this.innovationCardData.involvedAACProgrammes);
  }

  getFormattedList(list: string[]): string {
    return list.length > 0 ? list.join('. ') : 'None';
  }
}
