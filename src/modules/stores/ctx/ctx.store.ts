import { Injectable, inject } from '@angular/core';

import { InnovationContextStore } from './innovation/innovation-context.store';
import { AssessmentContextStore } from './assessment/assessment-context.store';
import { SchemaContextStore } from './schema/schema.store';
import { LayoutContextStore } from './layout/layout.store';

@Injectable()
export class CtxStore {
  readonly innovation: InnovationContextStore;
  readonly assessment: AssessmentContextStore;
  readonly schema: SchemaContextStore;
  readonly layout: LayoutContextStore;

  constructor() {
    this.innovation = inject(InnovationContextStore);
    this.assessment = inject(AssessmentContextStore);
    this.schema = inject(SchemaContextStore);
    this.layout = inject(LayoutContextStore);
  }
}
