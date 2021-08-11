export type MappedObject = {
  [key: string]: any;
};

export type AlertType = {
  type: null | '' | 'INFORMATION' | 'SUCCESS' | 'WARNING' | 'ERROR';
  title?: string;
  message?: string;
};
