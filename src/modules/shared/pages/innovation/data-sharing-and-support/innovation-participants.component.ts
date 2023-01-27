import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';

import { ContextInnovationType } from '@modules/stores/context/context.types';


@Component({
  selector: 'shared-pages-innovation-participants',
  templateUrl: './innovation-participants.component.html'
})
export class PageInnovationParticipantsComponent extends CoreComponent implements OnInit {

  innovation: ContextInnovationType;
  
  constructor(
  
  ) {

    super();
    this.setPageTitle('Everyone who is working with this innovation', { showPage: false });

    this.innovation = this.stores.context.getInnovation();

  }


  ngOnInit(): void {

    this.setPageStatus('LOADING')

    console.log(this.innovation.id)

    this.setPageStatus('READY')
  }

}
