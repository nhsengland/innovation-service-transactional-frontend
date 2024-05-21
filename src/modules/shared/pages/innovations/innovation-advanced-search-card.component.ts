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
  statusUpdatedAt: DateISOType;
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
  highlights?: Record<string, string[]>;
};

@Component({
  selector: 'theme-advanced-search-innovation-card',
  templateUrl: './innovation-advanced-search-card.component.html'
})
export class InnovationAdvancedSearchCardComponent extends CoreComponent implements OnInit {
  @Input({ required: true }) innovationCardData!: InnovationCardData;

  baseUrl: string;

  isAdminType: boolean;
  isAccessorType: boolean;
  isAssessmentType: boolean;

  isInnovationInArchivedStatus: boolean = false;

  isAccessorTypeAndArchivedInnovation: boolean = false;
  isAccessorTypeAndStoppedSharingInnovation: boolean = false;

  categoriesList: string = '';
  careSettingsList: string = '';
  diseasesAndConditionsList: string = '';
  keyHealthInequalitiesList: string = '';
  involvedAACProgrammesList: string = '';

  searchTermsFound: string[] = [];
  searchTermsCount = new Map<string, number>();
  snippet: string = '';

  goToSectionLink = { text: '', link: '', queryParams: { search: '' } };

  constructor() {
    super();

    this.baseUrl = `${this.stores.authentication.userUrlBasePath()}/innovations/`;

    this.isAdminType = this.stores.authentication.isAdminRole();
    this.isAccessorType = this.stores.authentication.isAccessorType();
    this.isAssessmentType = this.stores.authentication.isAssessmentType();
  }

  ngOnInit(): void {
    this.isInnovationInArchivedStatus = this.innovationCardData.status === InnovationStatusEnum.ARCHIVED;

    this.isAccessorTypeAndArchivedInnovation = this.isAccessorType && this.isInnovationInArchivedStatus;
    this.isAccessorTypeAndStoppedSharingInnovation =
      this.isAccessorType && this.innovationCardData.support?.closedReason === 'STOPPED_SHARED';

    this.categoriesList = this.getFormattedList(this.innovationCardData.categories);
    this.careSettingsList = this.getFormattedList(this.innovationCardData.careSettings);
    this.diseasesAndConditionsList = this.getFormattedList(this.innovationCardData.diseasesAndConditions);
    this.keyHealthInequalitiesList = this.getFormattedList(this.innovationCardData.keyHealthInequalities);
    this.involvedAACProgrammesList = this.getFormattedList(this.innovationCardData.involvedAACProgrammes);

    const searchTermsFoundWithDuplicates = this.getSearchTermsFound();
    this.searchTermsFound = [...new Set(searchTermsFoundWithDuplicates)];
    this.searchTermsCount = this.getSearchTermsCount(searchTermsFoundWithDuplicates);
    this.snippet = this.getHighlightSnippet();
    this.goToSectionLink = this.getGoToSectionLink();
  }

  private getFormattedList(list: string[]): string {
    return list.length > 0 ? list.join('. ') : 'None';
  }

  getSearchTermsFound() {
    const searchTermsFound: string[] = [];

    const highlights = this.innovationCardData.highlights;

    if (!highlights) {
      return searchTermsFound;
    }

    // Iterate over each value in the highlights object
    for (const value of Object.values(highlights)) {
      const text = value[0].toLowerCase();
      // Use a regular expression to find all occurrences of text within <em> tags
      const regex = /<em>(.*?)<\/em>/g;
      let match;

      // Loop through matches
      while ((match = regex.exec(text)) !== null) {
        // Add the matched text to our result array
        searchTermsFound.push(match[1]);
      }
    }

    return searchTermsFound;
  }

  getSearchTermsCount(searchTermsFoundWithDuplicates: string[]): Map<string, number> {
    const searchTermsCount = new Map<string, number>();

    // Count occurrences of each search term found
    for (const word of searchTermsFoundWithDuplicates) {
      const wordCapitalLetter = word.charAt(0).toUpperCase() + word.slice(1);
      const currentCount = searchTermsCount.get(wordCapitalLetter) || 0;
      searchTermsCount.set(wordCapitalLetter, currentCount + 1);
    }

    return searchTermsCount;
  }

  getHighlightSnippet(): string {
    const highlights = this.innovationCardData.highlights;

    if (!highlights) {
      return '';
    }

    // Remove <em> tags from the first highlight given by ES
    const snippet = Object.values(highlights)[0][0].replace(/<em>(.*?)<\/em>/g, '$1');

    return snippet;
  }

  getGoToSectionLink(): { text: string; link: string; queryParams: { search: string } } {
    let goToSectionLink = {
      text: '',
      link: '',
      queryParams: { search: this.searchTermsFound.join(' ') }
    };

    const highlights = this.innovationCardData.highlights;

    if (!highlights) {
      return goToSectionLink;
    }

    // Get the first key from highlight given by ES
    const firstKey = Object.keys(highlights)[0];
    const keyParts = firstKey.split('.');

    const innovationUrl = `/${this.baseUrl}${this.innovationCardData.id}`;

    if (keyParts[0] === 'document') {
      // If the key starts with document, it has data from IR
      const sectionId = keyParts[1];
      const sectionIdentification = this.stores.innovation.getInnovationRecordSectionIdentification(sectionId);
      goToSectionLink.text = `Go to section ${sectionIdentification?.group.number}.${sectionIdentification?.section.number} ${sectionIdentification?.section.title}`;

      if (this.isInnovationInArchivedStatus) {
        goToSectionLink.link = `${innovationUrl}/record/sections/all`;
      } else {
        goToSectionLink.link = `${innovationUrl}/record/sections/${sectionId}`;
      }
    } else if (keyParts[0] === 'owner') {
      // If the key starts with 'owner', it has data from overview
      goToSectionLink.text = 'Go to innovation overview';
      goToSectionLink.link = `${innovationUrl}/overview`;
    }

    return goToSectionLink;
  }
}
