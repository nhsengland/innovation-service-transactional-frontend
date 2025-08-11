import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { InnovationArchiveReasonEnum } from '@modules/feature-modules/innovator/services/innovator.service';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import {
  ContextInnovationType,
  InnovationCollaboratorStatusEnum,
  InnovationGroupedStatusEnum,
  InnovationSupportStatusEnum
} from '@modules/stores';

import { KeyProgressAreasPayloadType } from '@modules/theme/components/key-progress-areas-card/key-progress-areas-card.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-pages-innovation-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {
  innovationId: string;
  innovation: ContextInnovationType & {
    organisationsStatusDescription?: string;
    groupedStatus?: InnovationGroupedStatusEnum;
    archiveReason?: InnovationArchiveReasonEnum;
  };

  innovationSupport: {
    organisationUnit: string;
    status: InnovationSupportStatusEnum;
  } = { organisationUnit: '', status: InnovationSupportStatusEnum.UNASSIGNED };

  isArchived = false;

  innovationSummary: { label: string; value: null | string; copy?: boolean }[] = [];

  innovationCollaborators: {
    id: string;
    status: InnovationCollaboratorStatusEnum;
    name?: string;
    email?: string;
    role?: string;
  }[] = [];

  search?: string;

  innovationProgress: KeyProgressAreasPayloadType | undefined = undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.search = this.activatedRoute.snapshot.queryParams.search;

    this.innovation = this.ctx.innovation.info();
    this.isArchived = this.ctx.innovation.isArchived();

    this.setPageTitle('Overview', { hint: `Innovation ${this.innovation.name}` });
  }

  ngOnInit(): void {
    forkJoin({
      innovation: this.innovationsService.getInnovationInfo(this.innovationId),
      innovationCollaborators: this.innovationsService.getInnovationCollaboratorsList(this.innovationId, ['active']),
      innovationProgress: this.innovationsService.getInnovationProgress(this.innovationId, true)
    }).subscribe(({ innovation, innovationCollaborators, innovationProgress }) => {
      this.innovationSupport = {
        organisationUnit: this.ctx.user.getAccessorUnitName() ?? '',
        status: this.innovation.support?.status ?? InnovationSupportStatusEnum.UNASSIGNED
      };

      this.innovationSummary = [
        { label: 'Innovation ID', value: innovation.uniqueId, copy: true },
        { label: 'Company', value: innovation.owner?.organisation?.name ?? 'No company' },
        ...(innovation.owner?.organisation?.size
          ? [{ label: 'Company size', value: innovation.owner.organisation.size }]
          : []),
        ...(this.innovation.owner?.organisation?.registrationNumber
          ? [
              {
                label: 'Company UK registration number',
                value: this.innovation.owner.organisation.registrationNumber
              }
            ]
          : []),
        { label: 'Description', value: innovation.description },
        {
          label: 'Categories',
          value: innovation.categories
            .map(v =>
              v === 'OTHER'
                ? innovation.otherCategoryDescription
                : this.ctx.schema.getIrSchemaTranslationsMap()['questions'].get('categories')?.items.get(v)?.label
            )
            .join('\n')
        }
      ];

      const occurrences = (innovation.supports ?? [])
        .map(item => item.status)
        .filter(status => [InnovationSupportStatusEnum.ENGAGING].includes(status))
        .reduce(
          (acc, status) => (
            acc[status]
              ? ++acc[status].count
              : (acc[status] = {
                  count: 1,
                  text: this.translate('shared.catalog.innovation.support_status.' + status + '.name').toLowerCase()
                }),
            acc
          ),
          {} as Record<InnovationSupportStatusEnum, { count: number; text: string }>
        );

      this.innovation.organisationsStatusDescription = Object.values(occurrences)
        .map(item => `${item.count} ${item.text}`)
        .join(', ');

      this.innovation = {
        ...this.innovation,
        groupedStatus: innovation.groupedStatus,
        organisationsStatusDescription: Object.entries(occurrences)
          .map(([_, item]) => `${item.count} ${item.text}`)
          .join(', ')
      };

      this.innovationCollaborators = innovationCollaborators.data;

      this.innovationProgress = Object.keys(innovationProgress).length ? innovationProgress : undefined;

      this.setPageStatus('READY');
    });
  }

  getSupportStatusCount(supports: InnovationSupportStatusEnum[], status: keyof typeof InnovationSupportStatusEnum) {
    const statuses = supports.filter(cur => cur === status);
    return statuses.length;
  }
}
