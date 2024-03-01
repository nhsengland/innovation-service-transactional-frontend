export type DescriptionStepInputType = {
  selectedCategories: string[];
  selectedSubcategories: string[];
  description: string;
  file: null | File;
  fileName: string;
};

export type DescriptionStepOutputType = {
  description: string;
  file: null | File;
  fileName: string;
};
