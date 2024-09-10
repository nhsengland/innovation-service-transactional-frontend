import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';

@Component({
  selector: 'app-accessor-pages-innovation-support-organisations-referral-criteria',
  templateUrl: './organisation-referral-criteria.component.html'
})
export class InnovationSupportOrganisationReferralCriteriaComponent extends CoreComponent {
  organisationsInformation: {
    name: string;
    link: string;
    information: {
      type: 'BULLET_LIST' | 'PARAGRAPH';
      values: { description: string; subBullets?: string[]; link?: { url: string; label: string } }[];
    }[];
  }[] = [
    {
      name: 'Department for Business and Trade (DBT)',
      link: this.CONSTANTS.URLS.DBT,
      information: [
        {
          type: 'PARAGRAPH',
          values: [{ description: 'DBT can support innovations that are:' }]
        },
        {
          type: 'BULLET_LIST',
          values: [
            { description: 'in the later stages of the innovation process' },
            {
              description:
                'based in the UK, have a product ready for sale and a sense of what overseas markets they intend to enter'
            },
            { description: 'based overseas and are interested in direct investment in the UK' }
          ]
        },
        {
          type: 'PARAGRAPH',
          values: [{ description: 'DBT can:' }]
        },
        {
          type: 'BULLET_LIST',
          values: [
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
      name: 'Health Innovation Network (HIN)',
      link: this.CONSTANTS.URLS.HIN_NETWORK,
      information: [
        {
          type: 'PARAGRAPH',
          values: [
            {
              description: 'HINS can support innovations that are:'
            }
          ]
        },
        {
          type: 'BULLET_LIST',
          values: [
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
      name: 'Health Research Authority (HRA)',
      link: this.CONSTANTS.URLS.NHR,
      information: [
        {
          type: 'PARAGRAPH',
          values: [
            {
              description: 'HRA can support innovators who are:'
            }
          ]
        },
        {
          type: 'BULLET_LIST',
          values: [
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
      name: 'Health Technology Wales (HTW)',
      link: this.CONSTANTS.URLS.HEALTH_TECHNOLOGY,
      information: [
        {
          type: 'PARAGRAPH',
          values: [
            {
              description: 'HTW can support innovations that are:'
            }
          ]
        },
        {
          type: 'BULLET_LIST',
          values: [{ description: 'MedTech, devices, digital, care pathways, service models or surgical innovations' }]
        },
        {
          type: 'PARAGRAPH',
          values: [
            {
              description: 'HTW can support innovations when:'
            }
          ]
        },
        {
          type: 'BULLET_LIST',
          values: [
            { description: 'regulatory approvals are already in place, or there is evidence that this is underway' },
            { description: 'they are truly innovative or offers benefits above current standard care' },
            { description: 'they demonstrate evidence of patient benefit' }
          ]
        },
        {
          type: 'PARAGRAPH',
          values: [
            {
              description: 'Programmes:'
            }
          ]
        },
        {
          type: 'BULLET_LIST',
          values: [
            { description: 'Scientific advice commercial programme' },
            { description: 'Scientific advice specialist trial advice' }
          ]
        }
      ]
    },
    {
      name: 'Life Sciences Hub Wales',
      link: this.CONSTANTS.URLS.LSHUBWALES,
      information: [
        {
          type: 'PARAGRAPH',
          values: [
            {
              description: 'Life Sciences Hub Wales can support innovations that:'
            }
          ]
        },
        {
          type: 'BULLET_LIST',
          values: [{ description: 'are based in Wales' }]
        },
        {
          type: 'PARAGRAPH',
          values: [
            {
              description: 'Life Sciences Hub Wales can support innovators with:'
            }
          ]
        },
        {
          type: 'BULLET_LIST',
          values: [
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
        },
        {
          type: 'PARAGRAPH',
          values: [
            {
              description: 'Programmes:'
            }
          ]
        },
        {
          type: 'BULLET_LIST',
          values: [{ description: 'Digital Health Ecosystem Wales (DHEW)' }]
        }
      ]
    },
    {
      name: 'National Institute for Health and Care Excellence (NICE)',
      link: this.CONSTANTS.URLS.NICE,
      information: [
        {
          type: 'PARAGRAPH',
          values: [{ description: 'NICE:' }]
        },
        {
          type: 'BULLET_LIST',
          values: [
            {
              description:
                'produces guidance on medical devices, diagnostic technologies, interventional procedures, pharmaceuticals and digital health technologies'
            },
            {
              description:
                'makes decisions about which topics to select for guidance production through its prioritisation board and uses the NHS Innovation Service to help identify technologies that fit with those topics.',
              link: {
                url: this.CONSTANTS.URLS.NICE_KEY_PRIORITY_AREAS,
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
          type: 'PARAGRAPH',
          values: [{ description: 'NICE Advice supports innovations with:' }]
        },
        {
          type: 'BULLET_LIST',
          values: [
            {
              description: 'advice, including evidence gap analyses or scientific advice'
            },
            {
              description: 'insights, including system engagement meetings'
            },
            { description: 'education, including webinars and masterclasses' }
          ]
        },
        {
          type: 'PARAGRAPH',
          values: [{ description: 'NICE Advice supports innovations that:' }]
        },
        {
          type: 'BULLET_LIST',
          values: [
            {
              description:
                'have a medical purpose, for example for treatment, diagnosis, monitoring, self-management or behaviour changes'
            },
            {
              description: 'already have, or expected to receive, regulatory approval'
            }
          ]
        },
        {
          type: 'PARAGRAPH',
          values: [
            {
              description:
                'To note: NICE Advice cannot provide support on technologies that are part of an on-going appraisal. It is advised that any engagement with NICE Advice takes place before or after the formal evaluation process.'
            }
          ]
        }
      ]
    },
    {
      name: 'National Institute for Health and Care Research (NIHR)',
      link: this.CONSTANTS.URLS.NIHR,
      information: [
        {
          type: 'PARAGRAPH',
          values: [{ description: 'NIHR can support innovators with:' }]
        },
        {
          type: 'BULLET_LIST',
          values: [
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
      name: 'NHS Supply Chain',
      link: this.CONSTANTS.URLS.SUPPLY_CHAIN,
      information: [
        {
          type: 'PARAGRAPH',
          values: [{ description: 'NHS Supply Chain can support innovations that are:' }]
        },
        {
          type: 'BULLET_LIST',
          values: [
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
          type: 'PARAGRAPH',
          values: [{ description: 'NHS Supply Chain can support innovators by providing information on:' }]
        },
        {
          type: 'BULLET_LIST',
          values: [
            { description: 'public procurement regulations that need to be met' },
            { description: 'the contracts finder' },
            { description: 'MHRA regulations for public procurement at start of an engagement' }
          ]
        }
      ]
    },
    {
      name: 'Scottish Health Technologies Group (SHTG)',
      link: this.CONSTANTS.URLS.SHTG,
      information: [
        { type: 'PARAGRAPH', values: [{ description: 'To receive support from SHTG innovations must be:' }] },
        {
          type: 'BULLET_LIST',
          values: [
            { description: 'MedTech, devices, digital or diagnostics care pathways*' },
            { description: 'products with regulatory approval*' },
            { description: 'products with a well-defined evidence base*' },
            { description: 'new or innovative solutions' }
          ]
        },
        {
          type: 'PARAGRAPH',
          values: [{ description: '*The first three requirements must all be met to receive support' }]
        }
      ]
    }
  ];

  constructor() {
    super();

    this.setPageTitle('Referral criteria for support organisations on the NHS Innovation Service');

    this.setPageStatus('READY');
  }
}
