import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { ContextInnovationType } from '@modules/stores';

@Component({
  selector: 'app-innovator-pages-innovation-manage-access-overview',
  templateUrl: './manage-access-overview.component.html'
})
export class PageInnovationManageAccessOverviewComponent extends CoreComponent implements OnInit {
  innovationId: string;
  innovation: ContextInnovationType;
  innovationDescription: string | null = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = this.ctx.innovation.info();

    this.setPageTitle('You are collaborating on this innovation');
  }

  ngOnInit() {
    this.innovationsService.getInnovationInfo(this.innovationId).subscribe(innovationInfo => {
      this.innovationDescription = innovationInfo.description;
      this.setPageStatus('READY');
    });
  }
}
