import { BehaviorSubject, Observable } from 'rxjs';

import { ContextAssessmentType, ContextPageLayoutType } from './context.types';

// Store state model.
export class ContextModel {
  pageLayoutBS: BehaviorSubject<ContextPageLayoutType>;
  pageLayout$: Observable<ContextPageLayoutType>;

  notifications = {
    UNREAD: 0
  };

  // For assessment
  assessment: null | ContextAssessmentType = null;

  // For back link navigation
  currentUrl: string | null = null;
  previousUrl: string | null = null;

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
