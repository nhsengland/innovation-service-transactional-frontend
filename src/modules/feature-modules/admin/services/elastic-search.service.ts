import { Injectable } from '@angular/core';
import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';
import { Observable, take } from 'rxjs';

@Injectable()
export class ElasticSearchService extends CoreService {
  constructor() {
    super();
  }

  /**
   * Recreates the index (creates and ingests all documents)
   */
  reindex(): Observable<void> {
    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/search/reindex');
    return this.http.post<void>(url.buildUrl(), {}).pipe(take(1));
  }
}
