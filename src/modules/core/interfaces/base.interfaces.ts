export type MappedObject = {
  [key: string]: any;
};

export type LinkType = {
  type: 'link' | 'button';
  label: string;
  url: string;
  fullReload?: boolean;
};

export type AlertType = {
  type: null | '' | 'ACTION' | 'INFORMATION' | 'SUCCESS' | 'WARNING' | 'ERROR';
  title?: string;
  message?: string;
  setFocus?: boolean;
};

