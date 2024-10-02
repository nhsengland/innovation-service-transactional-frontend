import { Component, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { ContextInnovationType } from '@app/base/types';

@Component({
  selector: 'app-innovator-pages-innovation-section-submitted',
  templateUrl: './ir-submit.component.html'
})
export class IrSubmitComponent extends CoreComponent implements OnInit {
  innovation!: ContextInnovationType;

  constructor() {
    super();
  }

  ngOnInit() {
    this.innovation = this.stores.context.getInnovation();
    this.setPageTitle(`Your innovation is now ready to be submitted`, { size: 'l' });
    this.setPageStatus('READY');
  }
}
