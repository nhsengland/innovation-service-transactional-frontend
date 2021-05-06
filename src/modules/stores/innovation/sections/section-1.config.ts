import { WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


export const SECTION_1_CONFIG: InnovationSectionConfigType = {
  title: 'About your product or service',
  sections: [
    { id: InnovationSectionsIds.INNOVATION_DESCRIPTION, title: 'Description of innovation', wizard: new WizardEngineModel({}) },
    { id: InnovationSectionsIds.VALUE_PROPOSITION, title: 'Value proposition', wizard: new WizardEngineModel({}) }
  ]
};
