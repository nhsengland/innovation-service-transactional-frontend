import { WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


export const SECTION_3_CONFIG: InnovationSectionConfigType = {
  title: 'Business opportunity',
  sections: [
    { id: InnovationSectionsIds.MARKET_RESEARCH, title: 'Market research', wizard: new WizardEngineModel({}) },
    { id: InnovationSectionsIds.INTELLECTUAL_PROPERTY, title: 'Intellectual property', wizard: new WizardEngineModel({}) }
  ]
};
