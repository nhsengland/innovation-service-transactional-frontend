import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlModel } from '@app/base/models';
import { MappedObjectType } from '@app/base/types';
import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';
import { map, take } from 'rxjs/operators';
import { InnovationRecordSchemaInfoType } from './innovation-record-schema.models';
import { Observable } from 'rxjs';

@Injectable()
export class InnovationRecordSchemaService {
  private API_INNOVATIONS_URL = this.envVariablesStore.API_INNOVATIONS_URL;

  constructor(
    private http: HttpClient,
    private envVariablesStore: EnvironmentVariablesStore
  ) {}

  getLatestSchema(): Observable<InnovationRecordSchemaInfoType> {
    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/ir-schema');
    return this.http.get<InnovationRecordSchemaInfoType>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }
}
