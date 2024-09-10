import { URLS } from '@app/base/constants';
import { OrganisationInformation } from '../organisations-support-status-suggest.component';

export const ORGANISATIONS_INFORMATION: OrganisationInformation[] = [
  {
    displayName: 'Department for Business and Trade (DBT)',
    acronym: 'DBT',
    link: URLS.LIFE_SCIENCES_ORGANISATION,
    supportInformation: [
      {
        title: 'DBT can support innovations that are:',
        bulletPoints: [
          { description: 'in the later stages of the innovation process' },
          {
            description:
              'based in the UK, have a product ready for sale and a sense of what overseas markets they intend to enter'
          },
          { description: 'based overseas and are interested in direct investment in the UK' }
        ]
      },
      {
        title: 'DBT can:',
        bulletPoints: [
          { description: 'support UK companies wishing to initiate or expand their exports overseas' },
          {
            description:
              'support with foreign direct investment (FDI) opportunities, for example investor journey support, location opportunities, understanding tax and other incentives'
          },
          { description: 'provide general information on export support, public offer documents and directories' },
          {
            description:
              "refer the innovator to a DBT International Trade Adviser (ITA), to DBT staff based in overseas posts, to DBT's Investment Services team, to DBT's UK regional and DA partners, or within a DBT Sector team, for example Biopharma, Medtech or Digital Health"
          },
          {
            description:
              'support or signpost to opportunities for UK small and medium-sized enterprises (SMEs) seeking to raise venture capital, particularly for fundraising of Series A and beyond'
          }
        ]
      }
    ]
  },
  {
    displayName: 'Health Innovation Network (HIN)',
    acronym: 'HIN',
    link: URLS.HIN_NETWORK,
    supportInformation: [
      {
        title: 'HINS can support innovations that are:',
        bulletPoints: [
          { description: 'close to being adoption-ready' },
          { description: 'likely to be in scope for an NHS Supply Chain procurement framework' },
          { description: 'likely to be in scope for health technology appraisal' },
          {
            description:
              'likely to be in scope for advice and support on export to international markets, or establishing a business base within the UK for international companies'
          },
          {
            description:
              'likely to be in scope for other HINs for local adoption (a value proposition and business case have been developed)'
          }
        ]
      }
    ]
  },
  {
    displayName: 'Health Research Authority (HRA)',
    acronym: 'HRA',
    link: URLS.NHR,
    supportInformation: [
      {
        title: 'HRA can support innovators who are:',
        bulletPoints: [
          {
            description:
              'seeking advice on research for all types of technologies, including the legal requirements for using health and care data in the development of data driven research'
          },
          {
            description:
              'in early stage, who require guidance on research governance and clinical trial regulation (particularly in relation to public involvement, diversity and inclusion)'
          },
          {
            description:
              'seeking clarity on whether their study is defined as research and advice on the research regulatory approval processes'
          }
        ]
      }
    ]
  },
  {
    displayName: 'Health Technology Wales (HTW)',
    acronym: 'HTW',
    link: URLS.HEALTH_TECHNOLOGY,
    supportInformation: [
      {
        title: 'HTW can support innovations that are:',
        bulletPoints: [
          { description: 'MedTech, devices, digital, care pathways, service models or surgical innovations' }
        ]
      },
      {
        title: 'HTW can support innovations when:',
        bulletPoints: [
          { description: 'regulatory approvals are already in place, or there is evidence that this is underway' },
          { description: 'they are truly innovative or offers benefits above current standard care' },
          { description: 'they demonstrate evidence of patient benefit' }
        ]
      }
    ],
    programmes: ['Scientific advice commercial programme', 'Scientific advice specialist trial advice']
  },
  {
    displayName: 'Life Sciences Hub Wales',
    acronym: 'LSHW',
    link: URLS.LSHUBWALES,
    supportInformation: [
      {
        title: 'Life Sciences Hub Wales can support innovations that:',
        bulletPoints: [{ description: 'are based in Wales' }]
      },
      {
        title: 'Life Sciences Hub Wales can support innovators with:',
        bulletPoints: [
          { description: 'NHS Wales navigation' },
          { description: 'NHS Wales digital landscape navigation' },
          { description: 'Welsh Government policy' },
          {
            description:
              'healthcare system collaboration focused on preventive medicine and providing care closer to home'
          },
          { description: 'investment readiness and business development support' },
          { description: 'access to science parks' },
          { description: 'subject expertise and thematic focus groups' },
          { description: 'digital and AI' },
          { description: 'precision medicine (advanced therapies, early diagnostics)' },
          { description: 'user centred design and product design' },
          { description: 'research and development' },
          { description: 'academic collaboration' },
          { description: 'funding support' },
          { description: 'intellectual property' },
          { description: 'project management' }
        ]
      }
    ],
    programmes: ['Digital Health Ecosystem Wales (DHEW)']
  },
  {
    displayName: 'National Institute for Health and Care Excellence (NICE)',
    acronym: 'NICE',
    link: URLS.NICE,
    supportInformation: [
      {
        title: 'NICE:',
        bulletPoints: [
          {
            description:
              'produces guidance on medical devices, diagnostic technologies, interventional procedures, pharmaceuticals and digital health technologies'
          },
          {
            description:
              'makes decisions about which topics to select for guidance production through its prioritisation board and uses the NHS Innovation Service to help identify technologies that fit with those topics. ',
            link: {
              url: URLS.NICE_KEY_PRIORITY_AREAS,
              label: 'View key priority areas (opens in a new window)'
            }
          },
          {
            description:
              'provides support to developers of health technologies through a range of fee-based, not-for-profit services, via NICE Advice. Companies can use these services regardless of their route to market, for example NICE guidance verse non-NICE routes'
          }
        ]
      },
      {
        title: 'NICE Advice supports innovations with:',
        bulletPoints: [
          { description: 'advice, including evidence gap analyses or scientific advice' },
          { description: 'insights, including system engagement meetings' },
          { description: 'education, including webinars and masterclasses' }
        ]
      },
      {
        title: 'NICE Advice supports innovations that:',
        bulletPoints: [
          {
            description:
              'have a medical purpose, for example for treatment, diagnosis, monitoring, self-management or behaviour changes'
          },
          { description: 'already have, or expected to receive, regulatory approval' }
        ]
      },
      {
        title:
          'To note: NICE Advice cannot provide support on technologies that are part of an on-going appraisal. It is advised that any engagement with NICE Advice takes place before or after the formal evaluation process.',
        bulletPoints: []
      }
    ]
  },
  {
    displayName: 'National Institute for Health and Care Research (NIHR)',
    acronym: 'NIHR',
    link: URLS.NIHR,
    supportInformation: [
      {
        title: 'NIHR can support innovators with:',
        bulletPoints: [
          { description: 'research and study design - not just clinical trials' },
          {
            description:
              'clinical trial and evaluation - identifying and linking to suitable clinical partners, designing and costing research studies and protocols'
          },
          { description: 'real-world evidence gathering' },
          { description: 'health economic analysis' },
          { description: 'grant funding, and support to identify grant funds and apply for them' },
          { description: 'provision of patient and clinical data for research' },
          { description: 'provision of patient samples for research' }
        ]
      }
    ]
  },
  {
    displayName: 'NHS Supply Chain',
    acronym: 'NHS-SC',
    link: URLS.SUPPLY_CHAIN,
    supportInformation: [
      {
        title: 'NHS Supply Chain can support innovations that are:',
        bulletPoints: [
          { description: 'medical devices, equipment, consumables, goods and services used by hospitals' },
          { description: 'digital products that are associated with equipment' },
          { description: 'products which have a MedTech Funding Mandate' },
          {
            description:
              'appropriately regulated and certificated, or are likely to achieve this within the next 2 years'
          },
          {
            description:
              'new products that can demonstrate clinical effectiveness and key benefits over existing suppliers, for example additional cost savings'
          }
        ]
      },
      {
        title: 'NHS Supply Chain can support innovators by providing information on:',
        bulletPoints: [
          { description: 'public procurement regulations that need to be met' },
          { description: 'the contracts finder' },
          { description: 'MHRA regulations for public procurement at start of an engagement' }
        ]
      }
    ]
  },
  {
    displayName: 'Scottish Health Technologies Group (SHTG)',
    acronym: 'SHTG',
    link: URLS.SHTG,
    supportInformation: [
      {
        title: 'To receive support from SHTG innovations must be:',
        bulletPoints: [
          { description: 'MedTech, devices, digital or diagnostics care pathways*' },
          { description: 'products with regulatory approval*' },
          { description: 'products with a well-defined evidence base*' },
          { description: 'new or innovative solutions' }
        ],
        footnote: '*The first three requirements must all be met to receive support'
      }
    ]
  }
];
