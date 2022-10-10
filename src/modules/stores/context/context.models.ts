import { BehaviorSubject, Observable } from 'rxjs';

import { ContextInnovationType, ContextPageLayoutType } from './context.types';


// Store state model.
export class ContextModel {

  pageLayoutBS: BehaviorSubject<ContextPageLayoutType>;
  pageLayout$: Observable<ContextPageLayoutType>;

  notifications = {
    UNREAD: 0
  };

  // If has value, user is navigating within the context of a innovation.
  innovation: null | ContextInnovationType = null;


  constructor() {

    this.pageLayoutBS = new BehaviorSubject<ContextPageLayoutType>({
      alert: { type: null },
      backLink: { label: null },
      status: 'LOADING',
      title: { main: null }
    });
    this.pageLayout$ = this.pageLayoutBS.asObservable();

  }

}
