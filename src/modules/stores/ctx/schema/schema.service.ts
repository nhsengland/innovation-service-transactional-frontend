import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';

import { EnvironmentVariablesStore } from '@modules/core';

import { Observable, take } from 'rxjs';

import { UrlModel } from '@app/base/models';
import { ContextSchemaType } from './schema.types';

@Injectable()
export class SchemaContextService {
  private API_INNOVATIONS_URL = this.envVariablesStore.API_INNOVATIONS_URL;

  constructor(
    private http: HttpClient,
    private envVariablesStore: EnvironmentVariablesStore
  ) {}

  getLatestSchema(): Observable<ContextSchemaType['irSchema']> {
    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/ir-schema');
    return this.http.get<ContextSchemaType['irSchema']>(url.buildUrl()).pipe(take(1));
  }
}
