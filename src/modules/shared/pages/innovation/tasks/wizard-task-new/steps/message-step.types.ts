import { InnovationSectionEnum } from '@modules/stores/innovation';

export type MessageStepInputType = {
  selectedSection: null | string;
  message: string;
};

export type MessageStepOutputType = {
  message: string;
};
