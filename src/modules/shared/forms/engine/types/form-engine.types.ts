export type FileUploadType = {
  id: string;
  name: string;
  url: string
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
