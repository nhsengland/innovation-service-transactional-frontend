import { UserRoleEnum } from '@app/base/enums';
import { Dataset, FiltersConfig } from '@modules/core/models/filters/filters.model';
import { INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation';
import { locationItems } from '@modules/stores/innovation/config/innovation-catalog.config';
import {
  careSettingsItems,
  categoriesItems,
  diseasesConditionsImpactItems,
  involvedAACProgrammesItems,
  keyHealthInequalitiesItems
} from '@modules/stores/innovation/innovation-record/202304/forms.config';

export const InnovationsListFiltersConfig: FiltersConfig = {
  search: { key: 'search', placeholder: 'Search innovation', maxLength: 200 },
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
    { type: 'CHECKBOX_GROUP', key: 'categories', title: 'Categories', state: 'closed', items: [], scrollable: true },
    {
      type: 'CHECKBOX_GROUP',
      key: 'careSettings',
      title: 'Care settings',
      state: 'closed',
      items: [],
      scrollable: true
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
    {
      type: 'CHECKBOX_GROUP',
      key: 'keyHealthInequalities',
      title: 'Healthy inequalities',
      state: 'closed',
      items: [],
      scrollable: true
    },
    {
      type: 'CHECKBOX_GROUP',
      key: 'involvedAACProgrammes',
      title: 'AAC involvement',
      state: 'closed',
      items: [],
      scrollable: true
    },
    {
      type: 'CHECKBOX_GROUP',
      key: 'engagingOrganisations',
      title: 'Engaging organisations',
      state: 'closed',
      scrollable: true,
      searchable: true,
      items: []
    },
    { type: 'CHECKBOX_GROUP', key: 'supportStatuses', title: 'Support status', state: 'closed', items: [] },
    { type: 'CHECKBOX_GROUP', key: 'groupedStatuses', title: 'Innovation status', state: 'closed', items: [] },
    {
      type: 'DATE_RANGE',
      key: 'submittedAt',
      title: 'Filter by date',
      state: 'closed',
      startDate: { key: 'startDate', label: 'Submitted after', description: 'For example, 2005 or 21/11/2014' },
      endDate: { key: 'endDate', label: 'Submitted before', description: 'For example, 2005 or 21/11/2014' }
    }
  ]
};

const InnovationListDatasets: Record<string, Dataset> = {
  locations: locationItems.filter(i => i.label !== 'SEPARATOR').map(i => ({ label: i.label, value: i.value })),
  engagingOrganisations: [],
  supportStatuses: Object.entries(INNOVATION_SUPPORT_STATUS).map(([key, item]) => ({ value: key, label: item.label })),
  groupedStatuses: [],
  diseasesAndConditions: diseasesConditionsImpactItems,
  categories: [...categoriesItems, { value: 'OTHER', label: 'Other' }],
  careSettings: [...careSettingsItems, { value: 'OTHER', label: 'Other' }],
  keyHealthInequalities: keyHealthInequalitiesItems.filter(i => i.label !== 'SEPARATOR').map(i => ({ value: i.value, label: i.label }) ),
  involvedAACProgrammes: involvedAACProgrammesItems.filter(i => i.label !== 'SEPARATOR').map(i => ({ value: i.value, label: i.label }) )
};

export function getConfig(role?: UserRoleEnum): { filters: FiltersConfig; datasets: Record<string, Dataset> } {
  if (!role) return { filters: InnovationsListFiltersConfig, datasets: InnovationListDatasets };

  let filters = [
    'engagingOrganisations',
    'diseasesAndConditions',
    'locations',
    'supportStatuses',
    'assignedToMe',
    'suggestedOnly',
    'submittedAt',
    'categories',
    'careSettings'
  ];

  if (role === UserRoleEnum.ADMIN) {
    filters = [
      'locations',
      'engagingOrganisations',
      'diseasesAndConditions',
      'groupedStatuses',
      'submittedAt',
      'categories',
      'careSettings',
      'keyHealthInequalities',
      'involvedAACProgrammes'
    ];
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
