export type SubcategoriesStepInputType = {
  subcategories: { name: string; description: string }[];
  selectedCategories: string[];
  selectedSubcategories: string[];
};

export type SubcategoriesStepOutputType = {
  subcategories: string[];
};
