import { FiltersConfig } from '@modules/core/models/filters/filters.model';

export const InnovationActivityLogFiltersConfig: FiltersConfig = {
  filters: [
    { type: 'CHECKBOX_GROUP', key: 'activityTypes', title: 'Activity Types', state: 'closed', items: [] },
    {
      type: 'DATE_RANGE',
      key: 'createdAt',
      title: 'Activity Date',
      selectionTitle: 'Activity',
      state: 'closed',
      startDate: { key: 'startDate', label: 'Activity date after', description: 'For example, 2005 or 21/11/2014' },
      endDate: { key: 'endDate', label: 'Activity date before', description: 'For example, 2005 or 21/11/2014' }
    }
  ]
};

export function getConfig(): { filters: FiltersConfig } {
  return { filters: InnovationActivityLogFiltersConfig };
}
