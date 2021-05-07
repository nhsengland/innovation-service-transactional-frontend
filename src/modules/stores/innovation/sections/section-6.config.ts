import { WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


export const SECTION_6_CONFIG: InnovationSectionConfigType = {
  title: 'Cost, savings, and benefits',
  sections: [
    { id: InnovationSectionsIds.COST_OF_INNOVATION, title: 'Cost of your innovation', wizard: new WizardEngineModel({}) },
    { id: InnovationSectionsIds.COMPARATIVE_COST_BENEFIT, title: 'Comparative cost benefit', wizard: new WizardEngineModel({}) }
  ]
};
