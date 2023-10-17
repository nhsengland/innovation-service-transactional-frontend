import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';


@Component({
  selector: 'app-accessor-pages-innovation-support-organisations-referral-criteria',
  templateUrl: './organisation-referral-criteria.component.html'
})
export class InnovationSupportOrganisationReferralCriteriaComponent extends CoreComponent {

  organisationsInformation: {
    name: string,
    link: string,
    information: {
      type: 'BULLET_LIST' | 'PARAGRAPH',
      values: { description: string, subBullets?: string[] }[]
    }[]
  }[] = [
      {
        name: 'The Health Innovation Network (HIN)',
        link: this.CONSTANTS.URLS.HIN_NETWORK,
        information: [
          {
            type: 'BULLET_LIST',
            values: [
              { description: 'Innovation is close to being adoption-ready' },
              { description: 'Innovation is likely to be in scope for an NHS Supply Chain procurement framework' },
              { description: 'Innovation is likely to be in scope for health technology appraisal' },
              { description: 'Innovation is likely to be in scope for advice and support on export to international markets, or establishing a business base within the UK for international companies' },
              { description: 'Innovation is likely to be in scope for other AHSNs for local adoption (a value proposition and business case have been developed)' }
            ]
          }
        ]
      },
      {
        name: 'NHS Supply Chain',
        link: this.CONSTANTS.URLS.SUPPLY_CHAIN,
        information: [
          {
            type: 'BULLET_LIST',
            values: [
              { description: 'Medical devices, equipment, consumables, goods & services used by hospitals' },
              { description: 'Product and supplier must be appropriately regulated and certificated' },
              { description: 'New products need to demonstrate clinical effectiveness and key benefits over existing suppliers (e.g. additional cost savings)' },
              { description: 'Submissions which are also being allocated by NAS to NICE for MIB or other appraisal' },
              { description: 'Digital products that are associated with equipment' },
              { description: 'Products which have a Medtech Funding Mandate' },
              { description: '(For advice on future eligibility) Within 2 years of achieving and demonstrating criteria above' }
            ]
          }
        ]
      },
      {
        name: 'National Institute for Health and Care Excellence (NICE)',
        link: this.CONSTANTS.URLS.NICE,
        information: [
          {
            type: 'BULLET_LIST',
            values: [
              { description: 'Medical Devices, Diagnostic Technologies, Interventional Procedures, Pharmaceuticals and Digital Health' },
            ]
          },
          {
            type: 'PARAGRAPH',
            values: [
              { description: 'Criteria for guidance programmes (not early support):' }
            ]
          },
          {
            type: 'BULLET_LIST',
            values: [
              { description: 'Appropriate Regulatory approvals are in place or there are well developed plans in place to achieve this' },
              { description: 'There is a clear value proposition for guidance producing programmes (MTEP, DAP, IP & TA)' },
              { description: 'Evidence exists to support claims of benefits.' }
            ]
          },
          {
            type: 'PARAGRAPH',
            values: [
              { description: 'Criteria for early support, e.g. OMA, NICE Scientific Advice, META Tool:' }
            ]
          },
          {
            type: 'BULLET_LIST',
            values: [
              { description: 'Would be eligible for NICE guidance in the future' }
            ]
          }
        ]
      },
      {
        name: 'National Institute for Health Research (NIHR)',
        link: this.CONSTANTS.URLS.NIHR,
        information: [
          {
            type: 'BULLET_LIST',
            values: [
              { description: 'Collaboration in research and study design - not just clinical trials' },
              { description: 'Collaboration in clinical trial and evaluation - Identifying and linking to suitable clinical partners, designing and costing research studies & protocols' },
              { description: 'Collaboration in real-world evidence gathering' },
              { description: 'Health economic analysis' },
              { description: 'Grant funding, and support to identify grant funds and apply for them' },
              { description: 'Provision of patient and clinical data for research' },
              { description: 'Provision of patient samples for research' }
            ]
          }
        ]
      },
      {
        name: 'Life Sciences Organisation (LSO) - Part of Department for International Trade (DIT)',
        link: this.CONSTANTS.URLS.LIFE_SCIENCES_ORGANISATION,
        information: [
          {
            type: 'BULLET_LIST',
            values: [
              { description: 'UK-based companies seeking to reach international markets - NHS-based innovation, MedTech, BioPharma, Digital' },
              { description: 'International companies seeking to invest in the UK - MedTech, BioPharma, Digital' },
            ]
          }
        ]
      },
      {
        name: 'Health Research Authority (NHR)',
        link: this.CONSTANTS.URLS.NHR,
        information: [
          {
            type: 'BULLET_LIST',
            values: [
              { description: 'Innovators seeking advice on research for all types of technologies, including the legal requirements for using health and care data in the development of data-driven research' },
              { description: 'Early-stage innovators who require guidance on research governance and clinical trial regulation (particularly in relation to public involvement, diversity and inclusion)' },
              { description: 'Innovations seeking clarity on whether their study is defined as research and advice on the research regulatory approval processes' }
            ]
          }
        ]
      },
      {
        name: 'Health Technology Wales (HTW)',
        link: this.CONSTANTS.URLS.HEALTH_TECHNOLOGY,
        information: [
          {
            type: 'BULLET_LIST',
            values: [
              { description: 'MedTech, Devices, Digital, Care pathways / service models and Surgical innovations' },
              { description: 'Regulatory approval in place (or evidence this is underway)' },
              { description: 'Truly innovative or offer benefits above current standard care' },
              { description: 'Demonstrate evidence of patient benefit' },
            ]
          },
          {
            type: 'PARAGRAPH',
            values: [
              { description: 'Scientific Advice (SA) Commercial programme:' }
            ]
          },
          {
            type: 'BULLET_LIST',
            values: [
              { description: 'MedTech, Devices, Digital, Care pathways / service models and Surgical innovations' }
            ]
          },
          {
            type: 'PARAGRAPH',
            values: [
              { description: 'SA Specialist trial advice:' }
            ]
          },
          {
            type: 'BULLET_LIST',
            values: [
              { description: 'MedTech, Devices, Digital, Care pathways / service models and Surgical innovations' }
            ]
          }
        ]
      },
      {
        name: 'Life Science Hub Wales (LSHW)',
        link: this.CONSTANTS.URLS.LSHUBWALES,
        information: [
          {
            type: 'BULLET_LIST',
            values: [
              { description: 'All submissions originating in Wales' }
            ]
          },
          {
            type: 'PARAGRAPH',
            values: [
              { description: 'Programmes:' }
            ]
          },
          {
            type: 'BULLET_LIST',
            values: [
              { description: 'Accelerate Wales' },
              { description: 'Digital Health Ecosystem Wales (DHEW)' }
            ]
          },
          {
            type: 'PARAGRAPH',
            values: [
              { description: 'Specialist Support:' }
            ]
          },
          {
            type: 'BULLET_LIST',
            values: [
              { description: 'NHS Wales Navigation (Insights)' },
              { description: 'NHS Wales Digital Landscape Navigation' },
              { description: 'Welsh Government Policy - Healthcare system collaboration focused on Preventive Medicine & Providing Care Closer to Home' },
              { description: 'Investment Readiness and Business Development Support' },
              { description: 'Access to Science Parks' },
              {
                description: 'Subject Expertise and Thematic Focus Groups',
                subBullets: ['Digital & AI', 'Telehealth', 'Precision medicine (advanced therapies, early diagnostics)']
              },
              { description: 'User Centred Design / Product Design' },
              { description: 'Research and Development' },
              { description: 'Academic Collaboration' },
              { description: 'Funding Support' },
              { description: 'Intellectual Property' },
              { description: 'Project Management' }
            ]
          }
        ]
      },
      {
        name: 'Scottish Health Technology Group (SHTG)',
        link: this.CONSTANTS.URLS.SHTG,
        information: [
          {
            type: 'BULLET_LIST',
            values: [
              { description: 'MedTech, Devices, Digital, Diagnostics Care pathways*' },
              { description: 'Products with regulatory approval*' },
              { description: 'Products with a well-defined evidence base*' },
              { description: 'New / Innovative solutions' },
              { description: '*These requirements are not mutually exclusive; the first three requirements must all be present' }
            ]
          }
        ]
      }
    ];


  constructor() {

    super();

    this.setPageTitle('Referral criteria for organisations');

    this.setPageStatus('READY');

  }

}
