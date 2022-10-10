import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ContextStore } from '@modules/stores/context/context.store';


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  private contextStore: ContextStore;


  constructor(private injector: Injector) {
    this.contextStore = this.injector.get(ContextStore);
  }


  handleError(error: Error | HttpErrorResponse) {

    if (error instanceof HttpErrorResponse) { // Server error.

      console.error('SERVER ERROR: ', error);
      this.contextStore.setPageAlert({ type: 'ERROR', title: 'There is a problem', message: 'An error has occured while fetching information. Please, try again or contact us for further help', setFocus: true });
      this.contextStore.setPageStatus('ERROR');

    } else { // Client Error.

      console.error('CLIENT ERROR', error);
      this.contextStore.setPageAlert({ type: 'ERROR', title: 'There is a problem', message: 'An error has occured. Please, try again or contact us for further help', setFocus: true });

    }

    // Always log errors
    // logger.logError(message, stackTrace);
    // console.error('ERROR DETAILS', error);

  }

}
