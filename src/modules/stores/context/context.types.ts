import { NotificationContextTypeEnum } from './context.enums';
import { InnovationStatusEnum, InnovationSupportStatusEnum } from '../innovation/innovation.enums';


export type ContextPageAlertType = {
  type: null | 'ACTION' | 'INFORMATION' | 'SUCCESS' | 'WARNING' | 'ERROR',
  title?: string,
  message?: string,
  setFocus?: boolean
};

export type ContextPageBackLinkType = { label: null | string, hiddenLabel?: string, url?: string };

export type ContextPageStatusType = 'LOADING' | 'READY' | 'ERROR';

export type ContextPageTitleType = { main: null | string, secondary?: string };


export type ContextPageLayoutType = {
  alert: {
    type: null | 'ACTION' | 'INFORMATION' | 'SUCCESS' | 'WARNING' | 'ERROR',
    title?: string,
    message?: string,
    itemsList?: { title: string, description?: string, callback?: string | ((...p: any) => void) }[],
    width?: 'full' | '2.thirds',
    setFocus?: boolean,
    persistOneRedirect?: boolean
  },
  backLink: {
    label: null | string,
    url?: string,
    callback?: (...p: any) => void,
    hiddenLabel?: string,
  },
  status: 'LOADING' | 'READY' | 'ERROR',
  title: { main: null | string, secondary?: string, size?: 'xl' | 'l' }
};




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
  },
  notifications?: { [key in NotificationContextTypeEnum]?: number };
};
