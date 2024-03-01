export type CategoriesStepInputType = {
  milestonesType: 'ONE_LEVEL' | 'TWO_LEVEL';
  categories: { name: string; description: string }[];
  otherCategory: string | null;
  selectedCategories: string[];
};

export type CategoriesStepOutputType = {
  categories: string[];
  otherCategory: string | null;
};
