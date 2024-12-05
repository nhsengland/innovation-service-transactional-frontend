import { CoreService } from '@app/base';
import { Injectable } from '@angular/core';
import { FileUploadType } from '../forms/engine/config/form-engine.config';
import { map, Observable, take } from 'rxjs';
import { UrlModel } from '@app/base/models';

@Injectable()
export class FileUploadService extends CoreService {
  constructor() {
    super();
  }

  uploadFile(httpUploadBody: Record<string, string>, file: File): Observable<FileUploadType> {
    const httpUploadUrl = new UrlModel(this.APP_URL).addPath('upload-file').buildUrl();

    const formData = new FormData();
    formData.append('file', file, file.name);
    Object.entries(httpUploadBody || {}).forEach(([key, value]) => formData.append(key, value));

    return this.http.post<FileUploadType>(httpUploadUrl || '', formData).pipe(
      take(1),
      map(response => response)
    );
  }
}
