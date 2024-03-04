import { CategoriesStepOutputType } from './categories-step.types';
import { DateStepOutputType } from './date-step.types';
import { DescriptionStepOutputType } from './description-step.types';
import { SubcategoriesStepOutputType } from './subcategories-step.types';

export type SummaryStepInputType = {
  categoriesStep: CategoriesStepOutputType;
  subcategoriesStep: SubcategoriesStepOutputType;
  descriptionStep: DescriptionStepOutputType;
  dateStep: DateStepOutputType;
};
