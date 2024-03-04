export type CategoriesStepInputType = {
  userOrgAcronym: string;
  milestonesType: 'ONE_LEVEL' | 'TWO_LEVEL';
  categories: { name: string; description: string }[];
  otherCategory: string | null;
  selectedCategories: { name: string; description: string }[];
};

export type CategoriesStepOutputType = {
  categories: { name: string; description: string }[];
  otherCategory: string | null;
};
