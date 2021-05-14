import { InnovationSectionConfigType } from './innovation.models';

import { SECTION_1_1 } from './sections/section-1-1.config';
import { SECTION_1_2 } from './sections/section-1-2.config';

import { SECTION_2_1 } from './sections/section-2-1.config';
import { SECTION_2_2 } from './sections/section-2-2.config';
import { SECTION_2_3 } from './sections/section-2-3.config';

import { SECTION_3_CONFIG } from './sections/section-3.config';
import { SECTION_4_CONFIG } from './sections/section-4.config';
import { SECTION_5_CONFIG } from './sections/section-5.config';
import { SECTION_6_CONFIG } from './sections/section-6.config';
import { SECTION_7_CONFIG } from './sections/section-7.config';
import { SECTION_8_CONFIG } from './sections/section-8.config';


export const INNOVATION_SECTIONS: InnovationSectionConfigType[] = [
  {
    title: 'About your product or service',
    sections: [SECTION_1_1, SECTION_1_2]
  },
  {
    title: 'Needs, benefits and effectiveness',
    sections: [SECTION_2_1, SECTION_2_2, SECTION_2_3]
  },

  SECTION_3_CONFIG,
  SECTION_4_CONFIG,
  SECTION_5_CONFIG,
  SECTION_6_CONFIG,
  SECTION_7_CONFIG,
  SECTION_8_CONFIG
];
