import { WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


export const SECTION_8_1: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.IMPLEMENTATION_PLAN,
  title: 'Implementation plan and deployment',
  wizard: new WizardEngineModel({})
};
