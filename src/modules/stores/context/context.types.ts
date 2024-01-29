import { DateISOType, LinkType } from '@app/base/types';
import { InnovationStatusEnum, InnovationSupportStatusEnum } from '../innovation/innovation.enums';

import { NotificationCategoryTypeEnum } from './context.enums';

export type ContextPageAlertType = {
  type: null | 'ACTION' | 'INFORMATION' | 'SUCCESS' | 'WARNING' | 'ERROR';
  title?: string;
  message?: string;
  setFocus?: boolean;
};

export type ContextPageBackLinkType = { label: null | string; hiddenLabel?: string; url?: string };

export type ContextPageStatusType = 'LOADING' | 'READY' | 'ERROR';

export type ContextPageTitleType = { main: null | string; secondary?: string };

export type ContextPageLayoutType = {
  alert: {
    type: null | 'ACTION' | 'INFORMATION' | 'SUCCESS' | 'WARNING' | 'ERROR';
    title?: string;
    message?: string;
    itemsList?: { title: string; description?: string; callback?: string | ((...p: any) => void) }[];
    width?: 'full' | '2.thirds';
    setFocus?: boolean;
    persistOneRedirect?: boolean;
  };
  backLink: {
    label: null | string;
    url?: string;
    callback?: (...p: any) => void;
    hiddenLabel?: string;
  };
  status: 'LOADING' | 'READY' | 'ERROR';
  title: {
    main: null | string;
    secondary?: string;
    size?: 'xl' | 'l';
    width?: 'full' | '2.thirds';
    actions?: LinkType[];
  };
};

export type ContextInnovationType = {
  id: string;
  name: string;
  status: InnovationStatusEnum;
  statusUpdatedAt: null | DateISOType;
  countryName: string | null;
  description: string | null;
  postCode: string | null;
  categories: string[];
  otherCategoryDescription: string | null;
  owner?: {
    name: string;
    isActive: boolean;
    organisation?: { name: string; size: null | string; registrationNumber: null | string };
  };
  loggedUser: { isOwner: boolean };
  assessment?: { id: string; createdAt: DateISOType; finishedAt: null | DateISOType };
  assignedTo?: { id: string; userRoleId: string; name: string };
  support?: { id: string; status: InnovationSupportStatusEnum };
  notifications?: { [key in NotificationCategoryTypeEnum]?: number };
  collaboratorId?: string;
  createdAt?: DateISOType;
  reassessmentCount: number;
  expiryAt: number;
};
