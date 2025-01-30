import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CoreComponent } from '@app/base';
import { PluralTranslatePipe } from '@modules/shared/pipes/plural-translate.pipe';
import { InnovationSectionStatusEnum } from '@modules/stores';
import { SectionsSummaryModel } from '@modules/stores/ctx/innovation/innovation.models';
import { ThemeModule } from '@modules/theme/theme.module';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'shared-innovation-record-progress',
  templateUrl: './innovation-record-progress.component.html',
  imports: [ThemeModule, PluralTranslatePipe, TranslateModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styles: [':host { display: block; }'] // allow host element to be styled
})
export class InnovationRecordProgressComponent extends CoreComponent {
  sections = input.required<SectionsSummaryModel>();
  firstSubmission = input(false);

  flatSections = computed(() => this.sections().flatMap(s => s.sections));
  sectionsComplete = computed(() => this.flatSections().filter(s => s.status === 'SUBMITTED').length);
  sectionsDraft = computed(() => this.flatSections().filter(s => s.status === 'DRAFT').length);
  sectionsTotal = computed(() => this.flatSections().length);
  sectionsNotStarted = computed(() => this.flatSections().filter(s => s.status === 'NOT_STARTED').length);

  showDetailed = computed(() =>
    this.firstSubmission() && this.sectionsDraft() + this.sectionsNotStarted() < 4
      ? this.flatSections()
          .filter(s => s.status !== 'SUBMITTED')
          .map(s => {
            const identifier = this.ctx.schema.getIrSchemaSectionIdentificationV3(s.id);
            return {
              ...s,
              statusLabel: s.status === InnovationSectionStatusEnum.NOT_STARTED ? 'Start' : 'Complete',
              fullTitle: `${identifier?.group.number}.${identifier?.section.number} ${s.title}`
            };
          })
      : []
  );
}
