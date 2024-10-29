// Core types.
export {
  AlertType,
  DateISOType,
  LinkType,
  MappedObjectType,
  NotificationValueType
} from '@modules/core/interfaces/base.interfaces';
export { APIQueryParamsType } from '@modules/core/models/table.model';
export { WizardStepEventType, WizardStepComponentType } from '@modules/shared/wizards/wizard.types';

// Stores types.
export { ContextInnovationType } from '@modules/stores';

// Theme module types.
export { HeaderMenuBarItemType } from '@modules/theme/components/header/header.component';
export { HeaderNavigationBarItemType } from '@modules/theme/components/header/navigation-bar.component';
export { StatisticsCardType } from '@modules/theme/components/statistics-cards/statistics-cards.component';

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;
