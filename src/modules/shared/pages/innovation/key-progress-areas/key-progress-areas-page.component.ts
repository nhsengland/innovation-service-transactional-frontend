import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { ContextInnovationType } from '@app/base/types';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { KeyProgressAreasPayloadType } from '@modules/theme/components/key-progress-areas-card/key-progress-areas-card.component';

@Component({
  selector: 'app-key-progress-areas-page',
  templateUrl: './key-progress-areas-page.component.html'
})
export class KeyProgressAreasPageComponent extends CoreComponent implements OnInit {
  innovationId: string;
  innovation: ContextInnovationType;
  innovationProgress: KeyProgressAreasPayloadType | undefined = undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = this.ctx.innovation.info();

    this.setPageTitle('Key Progress Areas', { hint: this.innovation.name });
  }

  ngOnInit(): void {
    this.setPageStatus('LOADING');
    this.innovationsService.getInnovationProgress(this.innovationId, true).subscribe(innovationProgress => {
      this.innovationProgress = Object.keys(innovationProgress).length ? innovationProgress : undefined;
      this.setPageStatus('READY');
    });
  }
}
