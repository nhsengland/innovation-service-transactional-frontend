import { ComponentRef, Type } from '@angular/core';

export type VizardStep = {
  id: string;
  title: string;
  supportData?: Record<string, any>;
  component: Type<any>;
};
