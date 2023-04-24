import { Writeable } from '@app/base/types';

import { FormEngineParameterModel, WizardEngineModel } from '@modules/shared/forms';

import { InnovationSections as InnovationSection_202209 } from './202209/catalog.types';
import { InnovationSections as InnovationSection_202304 } from './202304/catalog.types';


export type InnovationSectionsVersions = InnovationSection_202209 | InnovationSection_202304;


export type FormSelectableFieldType<T> = {
  value: 'SEPARATOR' | Writeable<T>,
  label: 'SEPARATOR' | string,
  description?: string,
  group?: string,
  conditional?: FormEngineParameterModel
}[];


export type InnovationSectionConfigType<T = InnovationSectionsVersions> = {
  id: T,
  title: string,
  wizard: WizardEngineModel,
  evidences?: WizardEngineModel
};

export type InnovationSectionsListType = { title: string, sections: InnovationSectionConfigType[] }[];
