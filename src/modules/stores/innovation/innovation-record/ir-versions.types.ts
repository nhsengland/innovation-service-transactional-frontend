import { Writeable } from '@app/base/types';

import { FormEngineParameterModel, FormEngineParameterModelV3, WizardEngineModel } from '@modules/shared/forms';

import { InnovationSections as InnovationSection_202209 } from './202209/catalog.types';
import { InnovationSections as InnovationSection_202304 } from './202304/catalog.types';

export type InnovationSectionsVersions = InnovationSection_202209 | InnovationSection_202304;

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

export type InnovationSectionConfigType<T = InnovationSectionsVersions> = {
  id: T;
  title: string;
  wizard: WizardEngineModel;
  evidences?: WizardEngineModel;
  allStepsList?: InnovationSectionStepLabels;
};

export type InnovationSectionsListType = { title: string; sections: InnovationSectionConfigType[] }[];

export type InnovationSectionStepLabels = {
  [q: string]: { label: string; description?: string; conditional?: boolean };
};
