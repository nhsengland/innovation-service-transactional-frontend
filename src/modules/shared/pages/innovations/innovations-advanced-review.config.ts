import { UserRoleEnum } from '@app/base/enums';
import { Dataset, FiltersConfig } from '@modules/core/models/filters/filters.model';
import { INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation';
import { locationItems } from '@modules/stores/innovation/config/innovation-catalog.config';
import { diseasesConditionsImpactItems } from '@modules/stores/innovation/innovation-record/202304/forms.config';

export const InnovationsListFiltersConfig: FiltersConfig = {
  search: { key: 'search', placeholder: 'Search innovation' },
  filters: [
    {
      type: 'CHECKBOXES',
      key: 'checkboxes',
      checkboxes: [
        {
          key: 'assignedToMe',
          title: 'Only show innovations assigned to me',
          defaultValue: false,
          options: { updateOn: 'change' }
        },
        {
          key: 'suggestedOnly',
          title: 'Only show suggested innovations for my organisation',
          defaultValue: true,
          options: { updateOn: 'change' }
        }
      ]
    },
    { type: 'CHECKBOX_GROUP', key: 'locations', title: 'Location', state: 'closed', items: [] },
    { type: 'CHECKBOX_GROUP', key: 'groupedStatuses', title: 'Innovation status', state: 'closed', items: [] },
    {
      type: 'CHECKBOX_GROUP',
      key: 'engagingOrganisations',
      title: 'Engaging organisations',
      state: 'closed',
      scrollable: true,
      searchable: true,
      items: []
    },
    {
      type: 'CHECKBOX_GROUP',
      key: 'diseasesAndConditions',
      title: 'Diseases and conditions',
      state: 'closed',
      scrollable: true,
      searchable: true,
      items: []
    },
    { type: 'CHECKBOX_GROUP', key: 'supportStatuses', title: 'Support status', state: 'closed', items: [] }
  ]
};

const InnovationListDatasets: Record<string, Dataset> = {
  locations: locationItems.filter(i => i.label !== 'SEPARATOR').map(i => ({ label: i.label, value: i.value })),
  engagingOrganisations: [],
  supportStatuses: Object.entries(INNOVATION_SUPPORT_STATUS).map(([key, item]) => ({ value: key, label: item.label })),
  groupedStatuses: [],
  diseasesAndConditions: diseasesConditionsImpactItems
};

export function getConfig(role?: UserRoleEnum): { filters: FiltersConfig; datasets: Record<string, Dataset> } {
  if (!role) return { filters: InnovationsListFiltersConfig, datasets: InnovationListDatasets };

  let filters = [
    'engagingOrganisations',
    'diseasesAndConditions',
    'locations',
    'supportStatuses',
    'assignedToMe',
    'suggestedOnly'
  ];

  if (role === UserRoleEnum.ADMIN) {
    filters = ['engagingOrganisations', 'diseasesAndConditions', 'groupedStatuses'];
  }

  const config: FiltersConfig = { search: InnovationsListFiltersConfig.search, filters: [] };
  for (const filter of InnovationsListFiltersConfig.filters) {
    if (filter.type === 'CHECKBOXES') {
      filter.checkboxes = filter.checkboxes.filter(c => filters.includes(c.key));
      if (filter.checkboxes.length) {
        config.filters.push(filter);
      }
    } else if (filters.includes(filter.key)) {
      config.filters.push(filter);
    }
  }

  // Datasets changes
  const datasets = InnovationListDatasets;
  if (role === UserRoleEnum.ACCESSOR) {
    datasets.supportStatuses = datasets.supportStatuses.filter(s => ['ENGAGING', 'CLOSED'].includes(s.value));
  }

  return { filters: config, datasets };
}
