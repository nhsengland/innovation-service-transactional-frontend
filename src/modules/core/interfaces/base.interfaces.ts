export type MappedObject = {
  [key: string]: any;
};

export type AlertType = {
  type: null | '' | 'ACTION' | 'INFORMATION' | 'SUCCESS' | 'WARNING' | 'ERROR';
  title?: string;
  message?: string;
  setFocus?: boolean;
};
