import { NotificationContextTypeEnum } from './environment.enums';
import { InnovationStatusEnum, InnovationSupportStatusEnum } from '../innovation/innovation.enums';


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
  },
  notifications?: { [key in NotificationContextTypeEnum]: number };
};
