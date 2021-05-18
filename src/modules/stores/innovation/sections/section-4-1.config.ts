import { WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


export const SECTION_4_1: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.REGULATIONS_AND_STANDARDS,
  title: 'Standards and certifications',
  wizard: new WizardEngineModel({})
};

