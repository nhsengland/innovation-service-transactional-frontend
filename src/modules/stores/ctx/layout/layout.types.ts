import { LinkType } from '@app/base/types';

export type ContextLayoutType = PageLayoutContext & GeneralLayoutContext;

type PageLayoutContext = {
  status: 'LOADING' | 'READY' | 'ERROR';
  title: null | TitleType;
  alert: null | AlertType;
  backLink: null | BacklinkType;
};

type GeneralLayoutContext = {
  currentUrl: null | string;
  previousUrl: null | string;
};

type AlertType = {
  type: null | 'ACTION' | 'INFORMATION' | 'SUCCESS' | 'WARNING' | 'ERROR';
  title: string;
  message?: string;
  listStyleType?: 'bullet';
  itemsList?: {
    title: string;
    description?: string;
    fieldId?: string;
    callback?: string | ((...p: any) => void);
  }[];
  width?: 'full' | '2.thirds';
  setFocus?: boolean;
  persistOneRedirect?: boolean;
};

type BacklinkType = {
  label: string;
  hiddenLabel?: string;
  callback: string | ((...p: any) => void);
};

type TitleType = {
  main: string;
  secondary?: string;
  size?: 'xl' | 'l';
  width?: 'full' | '2.thirds';
  actions: LinkType[];
};

export const EMPTY_PAGE_CONTEXT: PageLayoutContext = {
  status: 'LOADING',
  title: null,
  alert: null,
  backLink: null
};
