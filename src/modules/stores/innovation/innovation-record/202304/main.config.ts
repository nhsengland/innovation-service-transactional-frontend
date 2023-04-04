import { InnovationSectionConfigType } from '../shared.types';

import { SECTION_1_1 } from './section-1-1.config';
// import { SECTION_2_1 } from './section-2-1.config';
// import { SECTION_2_2 } from './section-2-2.config';
import { SECTION_3_1 } from './section-3-1.config';
import { SECTION_3_2 } from './section-3-2.config';
import { SECTION_4_1 } from './section-4-1.config';
// import { SECTION_5_1 } from './section-5-1.config';
// import { SECTION_5_2 } from './section-5-2.config';
// import { SECTION_6_1 } from './section-6-1.config';
// import { SECTION_6_2 } from './section-6-2.config';
// import { SECTION_7_1 } from './section-7-1.config';
// import { SECTION_8_1 } from './section-8-1.config';

export const INNOVATION_SECTIONS: InnovationSectionConfigType = [
  { title: 'About your innovation', sections: [SECTION_1_1] },
  // { title: 'Needs, benefits and effectiveness', sections: [SECTION_2_1, SECTION_2_2, SECTION_2_3] },
  { title: 'Market research and current care pathway', sections: [SECTION_3_1, SECTION_3_2] },
  { title: 'Testing with userd', sections: [SECTION_4_1] },
  // { title: 'Care pathway and testing with users', sections: [SECTION_5_1, SECTION_5_2] },
  // { title: 'Cost, savings, and benefits', sections: [SECTION_6_1, SECTION_6_2] },
  // { title: 'Revenue model', sections: [SECTION_7_1] },
  // { title: 'Deployment', sections: [SECTION_8_1] }
];
