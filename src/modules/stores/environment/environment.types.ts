import { InnovationStatusEnum, InnovationSupportStatusEnum } from '@modules/shared/enums';


export type EnvironmentInnovationType = {
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
