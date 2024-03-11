export type DescriptionStepInputType = {
  selectedCategories: { name: string; description: string }[];
  otherCategory: string | null;
  selectedSubcategories: { name: string; description: string }[];
  description: string;
  file: null | File;
  fileName: string;
};

export type DescriptionStepOutputType = {
  description: string;
  file: null | File;
  fileName: string;
};
