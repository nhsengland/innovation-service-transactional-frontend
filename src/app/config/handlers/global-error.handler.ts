import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { CtxStore } from '@modules/stores';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private ctx: CtxStore;

  constructor(private injector: Injector) {
    this.ctx = this.injector.get(CtxStore);
  }

  handleError(error: Error | HttpErrorResponse) {
    if (error instanceof HttpErrorResponse) {
      // Server error.

      console.error('SERVER ERROR: ', error);
      this.ctx.layout.update({
        alert: {
          type: 'ERROR',
          title: 'There is a problem',
          message: 'An error has occured while fetching information. Please, try again or contact us for further help',
          setFocus: true
        }
      });
      this.ctx.layout.update({ status: 'ERROR' });
    } else {
      // Client Error.

      console.error('CLIENT ERROR', error);
      // this.contextStore.setPageAlert({ type: 'ERROR', title: 'There is a problem', message: 'An error has occured. Please, try again or contact us for further help', setFocus: true });
    }
  }
}
