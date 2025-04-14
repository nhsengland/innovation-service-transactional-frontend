export type Milestones = Record<
  string,
  {
    name: string;
    description: string;
    subcategories?: {
      name: string;
      description: string;
    }[];
  }[]
>;

export const SUPPORT_SUMMARY_MILESTONES: Milestones = {
  HIN: [
    {
      name: 'Initial research completed',
      description:
        'Initial informal search, such as reviewing existing academic literature and interviewing key opinion leaders.'
    },
    {
      name: 'Initial research support provided',
      description:
        'Support provided for initial informal search, such as reviewing existing academic literature and interviewing key opinion leaders.'
    },
    {
      name: 'Market analysis support provided',
      description:
        'Competitor analysis completed and understanding of at least Total Addressable Market, Serviceable Addressable Market, and Serviceable Obtainable Market.'
    },
    {
      name: 'Intellectual property options explored',
      description: 'Has an initial idea and has examined whether there is existing IP associated with their concept.'
    },
    { name: 'Intellectual property registered', description: 'IP has been registered.' },
    {
      name: 'Unmet needs explored',
      description: 'Clear understanding of the unmet need in the NHS and how their product addresses this gap.'
    },
    {
      name: 'Patient and public involvement element completed',
      description:
        'Has conducted a significant element of PPI, such as a workshop or onboarded a patient champion who has then contributed to product development.'
    },
    {
      name: 'Value proposition completed',
      description:
        'Has developed either a PowerPoint slide deck or infographic that clearly outlines its value to its target market by bringing in a variety of data and evidence.'
    },
    {
      name: 'Environmental sustainability support provided',
      description: 'Has received support to complete a carbon reduction plan and calculate their carbon footprint.'
    },
    {
      name: 'Carbon reduction plan completed',
      description: 'Has completed a carbon reduction plan and calculated their carbon footprint.'
    },
    {
      name: 'Prototype available',
      description:
        'Has an initial product that can be used/trialled but remains adaptable depending on results of initial testing.'
    },
    {
      name: 'Clinical trial completed with positive results',
      description: 'Has conducted a clinical trial in the UK with positive results.'
    },
    {
      name: 'Pilot completed with positive results',
      description: 'Conducted a pilot in an Integrated Care Board (ICB)/Trust with evaluated outcomes.'
    },
    {
      name: 'Regulatory approvals completed',
      description: 'Completed regulatory approval relevant to their product category.'
    },
    {
      name: 'Budget impact model or health economic analysis completed',
      description: 'Completed a budget impact model or health economic analysis covering their target patient cohort.'
    },
    {
      name: 'Business case template completed',
      description: 'Has completed an NHS business case template and has had it validated via an NHS trust.'
    },
    {
      name: 'Business model plans completed',
      description:
        'Has a thorough understanding of their business model and how they will bring their product to market. Has business plans in place to show development over the next 3 years.'
    },
    {
      name: 'Procurement route identified',
      description:
        'Understanding of their procurement route through NHS Supply Chain frameworks or knowing which NHS Tariffs they need to be a part of.'
    },
    {
      name: 'Market access plan completed',
      description:
        'Has created a market access plan with clear steps to engage with the NHS and its procurement systems.'
    },
    {
      name: 'Piloted in more than 1 ICB in a single region',
      description: 'Has been piloted with positive evaluation outcomes in more than 1 ICB in a single region.'
    },
    {
      name: 'Piloted in ICBs across multiple regions',
      description: 'Innovation has pilot sites in multiple ICBs across multiple regions.'
    },
    {
      name: 'Funding raised and funding plan completed',
      description:
        'Innovator has successfully raised funding and created a funding plan to show the progress/development over the next financial year.'
    },
    { name: 'Trading in other countries', description: 'Innovator has participated in trade in other countries.' }
  ].sort((a, b) => a.name.localeCompare(b.name)),
  'NHS-SC': [
    {
      name: "Procurement portal advice given with 'Find a Tender' service",
      description:
        'The innovator has been informed of the e tender platform for NHS Supply Chain and the public Contracts Finder for all public procurement that they may wish to bid on.'
    },
    {
      name: 'Linked with category team',
      description:
        'The product has been triaged and directed to the specialist category team for further in depth analysis.'
    },
    {
      name: 'Framework advised',
      description: 'The innovator has been directed to the most suitable framework with time frames.'
    },
    {
      name: 'Business as usual (BAU) procurement route identified',
      description:
        'If the product is not novel, as there are other products on the market with the same fit, form or function, the normal tendering process is advised. If product is novel and the framework is due to go to market soon.'
    },
    {
      name: 'Innovation procurement route identified',
      description:
        'If the product is novel and meets the needs of an innovation route, this route will be advised. This may accelerate the process of ensuring the product is available.'
    },
    {
      name: 'Procurement activity undergone',
      description:
        'The advised tender has been completed and awarded. The innovator either did not bid on the tender or did not meet the criteria of that tender.'
    },
    {
      name: 'Product available',
      description:
        'The advised tender process has completed and awarded. This product is now awarded will be available to the NHS.'
    }
  ],
  NICE: [
    {
      name: 'NICE Advice support offered',
      description: 'The team have offered the innovator support from one of the NICE Advice services.'
    },
    {
      name: 'Call arranged with innovator',
      description:
        'The NICE Advice team have arranged a call with the innovator to discuss the service offers in more detail.'
    },
    {
      name: 'Signposted to alternative support',
      description: 'The innovator has been referred to an alternative service for support.'
    },
    { name: 'NICE surgery', description: 'The innovator is undergoing a project with NICE Advice: NICE surgery.' },
    {
      name: 'Evidence gap analysis',
      description: 'The innovator is undergoing a project with NICE Advice: evidence gap analysis.'
    },
    {
      name: 'Scientific Advice',
      description: 'The innovator is undergoing a project with NICE Advice: Scientific Advice.'
    },
    {
      name: 'System engagement meeting',
      description: 'The innovator is undergoing a project with NICE Advice: system engagement meeting.'
    },
    {
      name: 'Health economic review',
      description: 'The innovator is undergoing a project with NICE Advice: health economic review.'
    },
    {
      name: 'Selected for NICE guidance output',
      description: "The innovation has been selected for inclusion in one of NICE's guidance producing programmes."
    }
  ],
  HTW: [
    {
      name: 'HTW Scientific Advice Service (SAS)',
      description: 'Select a sub category on the next page',
      subcategories: [
        {
          name: 'Enquiry received',
          description: 'The topic has been logged and is being reviewed by the HTW team.'
        },
        {
          name: 'Support offered',
          description: 'Support has been offered to innovator.'
        },
        {
          name: 'Unsuitable for HTW Scientific Advice Service (SAS) at this time',
          description:
            'After assessment by the HTW team the topic has been deemed unsuitable for HTW Scientific Advice Service (SAS) at this time.'
        }
      ]
    },
    {
      name: 'HTW Technology Appraisal (HTA)',
      description: 'Select a sub category on the next page',
      subcategories: [
        {
          name: 'Initial review',
          description: 'The topic has been logged and is being reviewed by HTW team.'
        },
        {
          name: 'Unsuitable for HTW Technology Appraisal (HTA) at this time',
          description:
            'After assessment by the HTW team the topic has been deemed unsuitable for HTW Technology Appraisal (HTA) at this time.'
        },
        {
          name: 'Topic Exploration Report (TER) in preparation',
          description:
            'Based on the information provided, HTW are preparing a Topic Exploration Report (TER). The TER aims to provide an overview of the available evidence on a technology.'
        },
        {
          name: 'Topic Exploration Report (TER) sent to innovator for comment',
          description: 'HTW have completed a Topic Exploration Report (TER) and have sent it to the Innovator.'
        },
        {
          name: 'Innovator contacted with queries',
          description: 'HTW have contacted the innovator with queries.'
        },
        {
          name: 'Topic Exploration Report (TER) completed',
          description: 'The Topic Exploration Report (TER) has been finalised and will be published on the HTW website.'
        }
      ]
    }
  ],
  LSHW: [
    {
      name: 'Refer and signpost',
      description:
        'Initial engagement with industry, researchers, clinicians and other collaborators to understand enquiry and alignment to the organisation.'
    },
    {
      name: 'Enquiry',
      description:
        'Gain understanding about needs, potential impacts and contribution to our strategic aims or provide support outside of a project.'
    },
    {
      name: 'Partnership and account management',
      description:
        'Providing long term account management and building partnerships to support development of project opportunities and collaborations.'
    },
    {
      name: 'Project management',
      description:
        'Coordination of stakeholders, project setup, communication with sponsors, and support for delivery of projects.'
    },
    {
      name: 'Horizon scanning and innovation scouting',
      description: 'Search for innovative solutions and methods to support healthcare challenges.'
    },
    {
      name: 'Funding and bid support',
      description:
        'Networking for collaborative bids, signposting to appropriate funding and support, or support for bid development.'
    },
    {
      name: 'Business case support',
      description: 'Support for business case development through review and analysis, and use of data.'
    },
    {
      name: 'Market analytics',
      description:
        'Analysis of Welsh, UK and International markets for development, strengths, gap analysis and emerging sector opportunities.'
    },
    {
      name: 'Celebrating innovation',
      description:
        'Coordination to celebrate health and social care innovation in Wales, sharing best practice through case studies, showcasing adopted solutions, innovation awards and amplifying challenges.'
    }
  ]
};
