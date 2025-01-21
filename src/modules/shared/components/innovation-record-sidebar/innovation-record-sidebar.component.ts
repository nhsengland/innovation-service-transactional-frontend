import { CommonModule, ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreComponent } from '@app/base';
import { ThemeModule } from '@modules/theme/theme.module';

type SectionStatus = 'not_started' | 'draft' | 'submitted';

@Component({
  selector: 'shared-innovation-record-sidebar-component',
  templateUrl: './innovation-record-sidebar.component.html',
  imports: [CommonModule, ThemeModule, RouterModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InnovationRecordSidebarComponent extends CoreComponent implements OnInit {
  sidebar = signal<
    {
      label: string;
      url: string;
      children?: { label: string; id: string; url: string; status: SectionStatus }[];
    }[]
  >([]);

  isAllSections = input(false);

  constructor(private scroller: ViewportScroller) {
    super();
  }

  ngOnInit(): void {
    const innovation = this.ctx.innovation.info();

    this.ctx.innovation.getAllSectionsInfo$(innovation.id).subscribe(sections => {
      const sectionsStatuses = new Map<string, SectionStatus>();
      for (const { section } of sections) {
        switch (section.status) {
          case 'SUBMITTED':
            sectionsStatuses.set(section.section, 'submitted');
            break;
          case 'DRAFT':
            sectionsStatuses.set(section.section, 'draft');
            break;
          default:
            sectionsStatuses.set(section.section, 'not_started');
        }
      }

      this.sidebar.set(
        this.ctx.schema.getIrSchemaSectionsTreeV3(this.ctx.user.userUrlBasePath(), innovation.id).map(s => ({
          ...s,
          children: s.children.map(sub => ({ ...sub, status: sectionsStatuses.get(sub.id) ?? 'not_started' }))
        }))
      );
    });
  }

  onScrollToSection(section: string, event: Event): void {
    this.scroller.scrollToAnchor(section);
    (event.target as HTMLElement).blur();
  }
}
