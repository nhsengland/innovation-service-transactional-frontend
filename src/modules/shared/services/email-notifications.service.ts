import { Injectable } from '@angular/core';
import { CoreService } from '@app/base';
import { MappedObject, UrlModel } from '@modules/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

export type getUserPreferenceResultDTO = {
  id: string;
  isSubscribed: boolean;
};

@Injectable()
export class EmailNotificationService extends CoreService {
  constructor() { super(); }

  getUserNotificationPreferences(): Observable<getUserPreferenceResultDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('user/:userId/notification-preference').setPathParams({ userId: this.stores.authentication.getUserId() });
    return this.http.get<getUserPreferenceResultDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  updateUserNotificationPreference(body: getUserPreferenceResultDTO[] ): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('user/:userId/notification-preference').setPathParams({ userId: this.stores.authentication.getUserId() });
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }
}
