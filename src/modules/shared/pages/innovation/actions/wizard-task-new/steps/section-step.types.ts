import { InnovationSectionEnum } from '@modules/stores/innovation';
import { InnovationSectionsListType } from '@modules/stores/innovation/innovation-record/ir-versions.types';


export type SectionStepInputType = {
  sections: InnovationSectionsListType,
  selectedSection: null | InnovationSectionEnum
};

export type SectionStepOutputType = {
  section: null | InnovationSectionEnum
};
