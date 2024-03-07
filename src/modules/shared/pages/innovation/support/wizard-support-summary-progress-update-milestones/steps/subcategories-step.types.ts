export type SubcategoriesStepInputType = {
  subcategories: { name: string; description: string }[];
  selectedCategories: { name: string; description: string }[];
  selectedSubcategories: { name: string; description: string }[];
};

export type SubcategoriesStepOutputType = {
  subcategories: { name: string; description: string }[];
};
