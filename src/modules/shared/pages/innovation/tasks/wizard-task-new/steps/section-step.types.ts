import { InnovationSectionEnum } from '@modules/stores/innovation';


export type SectionStepInputType = {
  sections: { value: string, label: string }[],
  selectedSection: null | InnovationSectionEnum
};

export type SectionStepOutputType = {
  section: null | InnovationSectionEnum
};
