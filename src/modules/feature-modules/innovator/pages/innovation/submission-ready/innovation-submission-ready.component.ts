import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CoreComponent } from '@app/base';
import { ThemeModule } from '@modules/theme/theme.module';

@Component({
  selector: 'app-innovation-submission-ready',
  templateUrl: './innovation-submission-ready.component.html',
  imports: [ThemeModule, RouterModule],
  standalone: true
})
export class InnovationSubmissionReadyComponent extends CoreComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.setPageTitle('All sections of your innovation record are complete');
    this.setPageStatus('READY');
  }

  submitForNeedsAssessment(): void {
    this.router.navigate(['../record/support'], { relativeTo: this.activatedRoute });
  }
}
