import { InnovationStatusEnum, InnovationSupportStatusEnum } from '@modules/shared/enums';


export class ContextModel {

  // If has value, user is navigating within the context of a innovation.
  innovation: null | ContextInnovationType = null;

  constructor() { }

}


export type ContextInnovationType = {
  id: string;
  name: string;
  status: InnovationStatusEnum;
  owner: {
    name: string;
    isActive: boolean;
  };
  assessment?: { id: string };
  support?: {
    id: string;
    status: InnovationSupportStatusEnum;
  }
};
