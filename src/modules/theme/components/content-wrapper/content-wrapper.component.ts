import { Component, Input } from '@angular/core';

import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';

@Component({
  selector: 'theme-content-wrapper',
  templateUrl: './content-wrapper.component.html'
})
export class ContentWrapperComponent {
  @Input() status: 'LOADING' | 'READY' | 'ERROR' = 'LOADING';

  errorImage: string;

  constructor(private environmentStore: EnvironmentVariablesStore) {
    this.errorImage = `${this.environmentStore.APP_ASSETS_URL}/images/exclamation-sign.png`;
  }
}
