import { Component, Input, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { DateISOType } from '@app/base/types';

export type InnovationCardData = {
  innovationId?: string;
  innovationName?: string;
  ownerName?: string;
  countryName?: string;
  postCode?: null | string;
  categories?: string[];
  careSettings?: string[];
  diseasesAndConditions?: string[];
  healthInequalities?: string[];
  aacInvolvement?: string[];
  submittedAt?: null | DateISOType;
  engagingUnits?: string[];
  supportStatus?: {
    status: string;
    updatedAt: DateISOType;
  };
  innovationStatus?: {
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

  isAdminType: boolean = false;
  isAccessorType = this.stores.authentication.isAccessorType();

  @Input({ required: true }) innovationCardData!: InnovationCardData;

  constructor() {
    super();

    this.baseUrl = this.baseUrl = `${this.stores.authentication.userUrlBasePath()}/innovations/`;

    this.isAdminType = this.stores.authentication.isAdminRole();
    this.isAccessorType = this.stores.authentication.isAccessorType();
  }

  ngOnInit(): void {
    console.log('');
  }
}
