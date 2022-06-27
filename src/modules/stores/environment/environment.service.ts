import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';
import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';

import { UrlModel } from '@modules/core/models/url.model';


// export type UserModulesType = '' | 'innovator' | 'accessor' | 'assessment';


type getUserUnreadNotificationsDTO = {
  count: number;
};


// export type ActivityLogInDTO = {
//   count: number;
//   data: {
//     date: string; // '2020-01-01T00:00:00.000Z',
//     type: keyof ActivityLogItemsEnum;
//     activity: ActivityLogItemsEnum;
//     innovation: { id: string, name: string };
//     params: {

//       actionUserName: string;
//       interveningUserName?: string;

//       assessmentId?: string;
//       sectionId?: InnovationSectionsIds;
//       actionId?: string;
//       innovationSupportStatus?: keyof typeof INNOVATION_SUPPORT_STATUS;

//       organisations?: string[];
//       organisationUnit?: string;
//       comment?: { id: string; value: string; };
//       totalActions?: number;

//     };
//   }[];
// };
// export type ActivityLogOutDTO = {
//   count: number;
//   data: (Omit<ActivityLogInDTO['data'][0], 'innovation' | 'params'>
//     & {
//       params: ActivityLogInDTO['data'][0]['params'] & {
//         innovationName: string;
//         sectionTitle: string;
//       };
//       link: null | { label: string; url: string; };
//     })[]
// };


@Injectable()
export class EnvironmentService {

  private API_URL = this.envVariablesStore.API_URL;

  constructor(
    private http: HttpClient,
    private authenticationStore: AuthenticationStore,
    private envVariablesStore: EnvironmentVariablesStore
  ) { }


  // private endpointModule(module: UserModulesType): string {
  //   switch (module) {
  //     case 'innovator':
  //       return 'innovators';
  //     case 'accessor':
  //       return 'accessors';
  //     case 'assessment':
  //       return 'assessments';
  //     default:
  //       return '';
  //   }
  // }


  getUserUnreadNotifications(): Observable<getUserUnreadNotificationsDTO> {

    return of({ count: Math.floor(Math.random() * 120) });

    const url = new UrlModel(this.API_URL).addPath('notifications');
    return this.http.get<getUserUnreadNotificationsDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

}
