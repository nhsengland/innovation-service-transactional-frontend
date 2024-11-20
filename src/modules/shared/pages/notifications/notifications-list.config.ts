import { FiltersConfig } from '@modules/core/models/filters/filters.model';

export const NotificationsListFiltersConfig: FiltersConfig = {
  filters: [
    { type: 'CHECKBOX_GROUP', key: 'contextTypes', title: 'Types', state: 'opened', items: [] },
    {
      type: 'CHECKBOXES',
      key: 'checkboxes',
      checkboxes: [
        {
          key: 'unreadOnly',
          title: 'Show only unread notifications',
          defaultValue: false,
          translation: 'Viewing only unread notifications',
          options: { updateOn: 'change' }
        }
      ]
    }
  ]
};

export function getConfig(): { filters: FiltersConfig } {
  return { filters: NotificationsListFiltersConfig };
}
