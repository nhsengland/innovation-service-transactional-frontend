export type SectionStepInputType = {
  sections: { value: string; label: string }[];
  selectedSection: null | string;
};

export type SectionStepOutputType = {
  section: null | string;
};
