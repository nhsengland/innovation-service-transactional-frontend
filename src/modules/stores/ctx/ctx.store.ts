import { Injectable, inject } from '@angular/core';

import { InnovationContextStore } from './innovation/innovation-context.store';

@Injectable()
export class CtxStore {
  readonly innovation: InnovationContextStore;

  constructor() {
    this.innovation = inject(InnovationContextStore);
  }
}
