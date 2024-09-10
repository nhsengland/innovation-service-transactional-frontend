export type FileUploadType = {
  id: string;
  name: string;
  size?: number;
  extension: string;
  url: string;
};

export enum FileTypes {
  ALL = '*',
  JPEG = '.jpeg',
  JPG = '.jpg',
  PNG = '.png',
  GIF = '.gif',
  CSV = '.csv',
  XLSX = '.xlsx',
  DOCX = '.docx',
  PDF = '.pdf'
}

export const TEXTAREA_LENGTH_LIMIT = {
  xs: 200,
  s: 500,
  m: 1000,
  l: 1500,
  xl: 2000,
  xxl: 4000
};
export type TextareaLengthLimitType = keyof typeof TEXTAREA_LENGTH_LIMIT;

export const INPUT_LENGTH_LIMIT = {
  xxs: 100,
  xs: 200,
  l: 1500
};
export type InputLengthLimitType = keyof typeof INPUT_LENGTH_LIMIT;
