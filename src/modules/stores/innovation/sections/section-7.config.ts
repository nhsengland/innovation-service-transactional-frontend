import { WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


export const SECTION_7_CONFIG: InnovationSectionConfigType = {
  title: 'Revenue model',
  sections: [
    { id: InnovationSectionsIds.REVENUE_MODEL, title: 'Revenue model', wizard: new WizardEngineModel({}) }
  ]
};
