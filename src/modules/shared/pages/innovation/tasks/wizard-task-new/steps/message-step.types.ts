import { InnovationSectionEnum } from '@modules/stores/innovation';

export type MessageStepInputType = {
  selectedSection: null | InnovationSectionEnum;
  message: string;
};

export type MessageStepOutputType = {
  message: string;
};
