type Milestones = {
  [orgAcronym: string]: {
    name: string;
    description: string;
    subcategories?: {
      name: string;
      description: string;
    }[];
  }[];
};

export const SUPPORT_SUMMARY_MILESTONES: Milestones = {
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
  ]
};
