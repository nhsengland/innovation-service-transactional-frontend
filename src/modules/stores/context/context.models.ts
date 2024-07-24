import { BehaviorSubject, Observable } from 'rxjs';

import {
  ContextAssessmentType,
  ContextInnovationType,
  ContextPageLayoutType,
  ContextSchemaType
} from './context.types';

// Store state model.
export class ContextModel {
  pageLayoutBS: BehaviorSubject<ContextPageLayoutType>;
  pageLayout$: Observable<ContextPageLayoutType>;

  notifications = {
    UNREAD: 0
  };

  // If has value, user is navigating within the context of a innovation.
  innovation: null | ContextInnovationType = null;

  // For Innovation Record Schema
  irSchema: null | ContextSchemaType = null;

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
