import { Component, Input, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { DateISOType } from '@app/base/types';
import {
  InnovationStatusEnum,
  InnovationSupportStatusEnum,
  InnovationGroupedStatusEnum,
  InnovationSupportCloseReasonEnum
} from '@modules/stores';

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
    closeReason: InnovationSupportCloseReasonEnum | null;
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

  highlightInfo?: {
    termsFound: string[];
    termsCount: Map<string, number>;
    snippet: string;
    linkInfo: { text: string; link: string; queryParams?: { search: string }; fragment?: string };
  };

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
      this.isAccessorType && this.innovationCardData.support?.closeReason === 'STOP_SHARE';

    this.categoriesList = this.getFormattedList(this.innovationCardData.categories);
    this.careSettingsList = this.getFormattedList(this.innovationCardData.careSettings);
    this.diseasesAndConditionsList = this.getFormattedList(this.innovationCardData.diseasesAndConditions);
    this.keyHealthInequalitiesList = this.getFormattedList(this.innovationCardData.keyHealthInequalities);
    this.involvedAACProgrammesList = this.getFormattedList(this.innovationCardData.involvedAACProgrammes);

    if (this.innovationCardData.highlights && Object.keys(this.innovationCardData.highlights).length != 0) {
      const searchTermsFoundWithDuplicates = this.getSearchTermsFound(this.innovationCardData.highlights);
      const [firstKey, firstValue] = Object.entries(this.innovationCardData.highlights)[0];

      this.highlightInfo = {
        termsFound: [...new Set(searchTermsFoundWithDuplicates)],
        termsCount: this.getSearchTermsCount(searchTermsFoundWithDuplicates),
        snippet: this.getSnippetFromHighlight(firstValue[0]),
        linkInfo: this.getLinkFromHighlight(firstKey)
      };

      this.highlightInfo.linkInfo.queryParams = { search: this.highlightInfo?.termsFound.join(' ') };
    }
  }

  private getFormattedList(list: string[]): string {
    return list.length > 0 ? list.join('. ') : 'None';
  }

  getSearchTermsFound(highlights: Record<string, string[]>) {
    const searchTermsFound: string[] = [];
    const regex = /<em>(.*?)<\/em>/g;

    // Iterate over each value in the highlights object
    for (const values of Object.values(highlights)) {
      for (const value of values) {
        const text = value.toLowerCase();
        // Use a regular expression to find all occurrences of text within <em> tags
        let match;
        // Loop through matches
        while ((match = regex.exec(text)) !== null) {
          // Add the matched text to our result array
          const foundMatch = match[1].split(' ');
          foundMatch.forEach(match => {
            searchTermsFound.push(match);
          });
        }
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

  getSnippetFromHighlight(firstValueFromHighlight: string): string {
    // Remove <em> tags from the first highlight given by ES
    const snippet = firstValueFromHighlight.replace(/<em>(.*?)<\/em>/g, '$1');

    return snippet;
  }

  getLinkFromHighlight(firstKeyFromHighlight: string): {
    text: string;
    link: string;
    fragment?: string;
  } {
    let linkInfo: { text: string; link: string; fragment?: string } = {
      text: '',
      link: ''
    };

    const innovationUrl = `/${this.baseUrl}${this.innovationCardData.id}`;

    const keyParts = firstKeyFromHighlight.split('.');

    if (keyParts[0] === 'document') {
      // If the key starts with document, it has data from IR
      let sectionId = keyParts[1];
      if (keyParts[1] === 'evidences') {
        // Set
        sectionId = 'EVIDENCE_OF_EFFECTIVENESS';
      }
      const sectionIdentification = this.ctx.schema.getIrSchemaSectionIdentificationV3(sectionId);
      linkInfo.text = `Go to section ${sectionIdentification?.group.number}.${sectionIdentification?.section.number} ${sectionIdentification?.section.title}`;

      if (this.isInnovationInArchivedStatus) {
        linkInfo.link = `${innovationUrl}/record/sections/all`;
        linkInfo.fragment = sectionId;
      } else {
        linkInfo.link = `${innovationUrl}/record/sections/${sectionId}`;
      }
    } else if (keyParts[0] === 'owner') {
      // If the key starts with 'owner', it has data from overview
      linkInfo.text = 'Go to innovation overview';
      linkInfo.link = `${innovationUrl}/overview`;
    }

    return linkInfo;
  }
}
