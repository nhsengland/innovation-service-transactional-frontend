import { Component, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';

export type TrainingAndResourcesCard = {

  title: string,
  label: string,
  link: string

}


@Component({
  selector: 'app-training-and-resources',
  templateUrl: './training-and-resources.component.html',
})
export class TrainingAndResourcesComponent extends CoreComponent implements OnInit {

  cardsList: TrainingAndResourcesCard[];
  
  constructor() {
    super();

    this.cardsList = [
      {
        title: 'Innovators',
        label: 'Guidance for innovators when using the NHS Innovation Service.',
        link: `${ this.CONSTANTS.URLS.TRAINING_AND_RESOURCES_INNOVATOR_GUIDANCE }`
      },
      {
        title: 'Support organisations',
        label: 'Guidance for qualifying accessors and accessors on how to use the NHS Innovation Service.',
        link: `${ this.CONSTANTS.URLS.TRAINING_AND_RESOURCES_SUPPORT_ORGANISATION }`
      },
    ];

  }

  ngOnInit(): void {

    this.setPageStatus('LOADING');

    this.setPageTitle('Training and resources');

    this.setPageStatus('READY');

  }

  
}
