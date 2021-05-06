import { UploadsEvents } from './uploads-events.enum';

export class UploadConfigurationModel {

  url: string;
  acceptedFiles?: string;
  uploadedFilesActions?: any; // UploadedFileActionModel[];
  defaultMessage?: string;
  removeFileConfirmationMessage?: string;
  maxFileSize?: number;
  maxFiles?: number;
  headers?: object;
  params?: object;
  style?: {
    heightLevel: 1 | 2 | 3 | 4;
  };

  constructor(data: UploadConfigurationModel) {
    this.url = data.url;
    this.acceptedFiles = data.acceptedFiles || '';
    this.uploadedFilesActions = data.uploadedFilesActions || [];
    this.defaultMessage = data.defaultMessage || '';
    this.removeFileConfirmationMessage = data.removeFileConfirmationMessage || '';
    this.maxFileSize = data.maxFileSize || 2; // in MB!
    this.maxFiles = data.maxFiles;
    this.headers = data.headers;
    this.params = data.params;
    this.style = {
      heightLevel: data.style?.heightLevel || 1
    };
  }
}

// type UploadedFileActionModel = {
//   id: string;
//   title: string;
//   icon: string;
//   cb: (item: any) => void; // Callback for the action to call when clicked.
// }


// export type UploadEventModel<T = {}> = {
//   type: UploadsEvents;
//   response: T;
// }

