import { WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


export const SECTION_4_CONFIG: InnovationSectionConfigType = {
  title: 'Regulations and standards',
  sections: [
    { id: InnovationSectionsIds.REGULATIONS_AND_STANDARDS, title: 'Regulations and standards', wizard: new WizardEngineModel({}) }
  ]
};
