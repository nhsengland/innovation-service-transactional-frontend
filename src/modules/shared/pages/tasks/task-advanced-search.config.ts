import { UserRoleEnum } from '@app/base/enums';
import { Dataset, FiltersConfig } from '@modules/core/models/filters/filters.model';
import { InnovationStatusEnum } from '@modules/stores/innovation';
import { getAllSectionsList } from '@modules/stores/innovation/innovation-record/ir-versions.config';

export const TaskAdvancedSearchFiltersConfig: FiltersConfig = {
  search: { key: 'innovationName', placeholder: 'Search by innovation name', maxLength: 200 },
  filters: [
    {
      type: 'CHECKBOXES',
      key: 'checkboxes',
      checkboxes: [
        {
          key: 'createdByMe',
          title: 'Show only tasks assigned by me',
          defaultValue: false,
          translation: 'Viewing tasks assigned to me'
        }
      ]
    },
    { type: 'CHECKBOX_GROUP', key: 'status', title: 'Task status', state: 'closed', items: [] },
    { type: 'CHECKBOX_GROUP', key: 'sections', title: 'Innovation record section', state: 'closed', items: [] },
    { type: 'CHECKBOX_GROUP', key: 'innovationStatus', title: 'Needs assessment status', state: 'closed', items: [] }
  ]
};

const TaskAdvancedSearchDatasets: Record<string, Dataset> = {
  status: [],
  sections: getAllSectionsList(),
  innovationStatus: [
    { label: 'Needs assessment in progress', value: InnovationStatusEnum.NEEDS_ASSESSMENT },
    { label: 'Needs assessment completed', value: InnovationStatusEnum.IN_PROGRESS }
  ]
};

export function getConfig(role: UserRoleEnum): { filters: FiltersConfig; datasets: Record<string, Dataset> } {
  const config: FiltersConfig = TaskAdvancedSearchFiltersConfig;
  if (role !== UserRoleEnum.ASSESSMENT) {
    config.filters = config.filters.filter(f => f.key !== 'innovationStatus');
  }

  return { filters: config, datasets: TaskAdvancedSearchDatasets };
}
