import { WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


export const SECTION_8_CONFIG: InnovationSectionConfigType = {
  title: 'Deployment',
  sections: [
    { id: InnovationSectionsIds.IMPLEMENTATION_PLAN, title: 'Implementation plan and deployment', wizard: new WizardEngineModel({}) },
    { id: InnovationSectionsIds.VALUE_PROPOSITION, title: 'Value proposition', wizard: new WizardEngineModel({}) }
  ]
};
