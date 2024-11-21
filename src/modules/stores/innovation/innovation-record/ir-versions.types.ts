import { Writeable } from '@app/base/types';

import { FormEngineParameterModel, FormEngineParameterModelV3 } from '@modules/shared/forms';

export type FormSelectableFieldType<T> = {
  value: 'SEPARATOR' | Writeable<T>;
  label: 'SEPARATOR' | string;
  description?: string;
  group?: string;
  conditional?: FormEngineParameterModel;
  exclusive?: boolean;
}[];

export type FormSelectableFieldV3Type<T> = {
  value: 'SEPARATOR' | Writeable<T>;
  label: 'SEPARATOR' | string;
  description?: string;
  group?: string;
  conditional?: FormEngineParameterModelV3;
  exclusive?: boolean;
}[];

export type InnovationSectionStepLabels = Record<
  string,
  { label: string; description?: string; conditional?: boolean }
>;
