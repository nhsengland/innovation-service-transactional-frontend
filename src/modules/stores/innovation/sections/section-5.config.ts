import { WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


export const SECTION_5_CONFIG: InnovationSectionConfigType = {
  title: 'Care pathway and testing with users',
  sections: [
    { id: InnovationSectionsIds.CURRENT_CARE_PATHWAY, title: 'Current care pathway', wizard: new WizardEngineModel({}) },
    { id: InnovationSectionsIds.TESTING_WITH_USERS, title: 'Testing with users', wizard: new WizardEngineModel({}) }
  ]
};
