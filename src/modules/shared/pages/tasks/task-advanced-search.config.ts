import { UserRoleEnum } from '@app/base/enums';
import { Dataset, FiltersConfig } from '@modules/core/models/filters/filters.model';
import { InnovationStatusEnum } from '@modules/stores';
import { InnovationRecordSchemaInfoType } from '@modules/stores/innovation/innovation-record/innovation-record-schema/innovation-record-schema.models';
import { getAllSectionsListV3 } from '@modules/stores/innovation/innovation-record/ir-versions.config';

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
          translation: 'Viewing tasks assigned to me',
          options: { updateOn: 'change' }
        }
      ]
    },
    { type: 'CHECKBOX_GROUP', key: 'status', title: 'Task status', state: 'closed', items: [] },
    { type: 'CHECKBOX_GROUP', key: 'sections', title: 'Innovation record section', state: 'closed', items: [] },
    { type: 'CHECKBOX_GROUP', key: 'innovationStatus', title: 'Needs assessment status', state: 'closed', items: [] }
  ]
};

export function getConfig(
  role: UserRoleEnum,
  schema: InnovationRecordSchemaInfoType
): { filters: FiltersConfig; datasets: Record<string, Dataset> } {
  const config: FiltersConfig = TaskAdvancedSearchFiltersConfig;
  if (role !== UserRoleEnum.ASSESSMENT) {
    config.filters = config.filters.filter(f => f.key !== 'innovationStatus');
  }

  const TaskAdvancedSearchDatasets: Record<string, Dataset> = {
    status: [],
    sections: getAllSectionsListV3(schema),
    innovationStatus: [
      { label: 'Needs assessment in progress', value: InnovationStatusEnum.NEEDS_ASSESSMENT },
      { label: 'Needs assessment completed', value: InnovationStatusEnum.IN_PROGRESS }
    ]
  };

  return { filters: config, datasets: TaskAdvancedSearchDatasets };
}
