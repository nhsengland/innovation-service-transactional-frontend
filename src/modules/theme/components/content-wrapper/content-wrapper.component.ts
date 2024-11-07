import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';

@Component({
  selector: 'theme-content-wrapper',
  templateUrl: './content-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentWrapperComponent {
  status = input.required<'LOADING' | 'READY' | 'ERROR'>();

  errorImage: string;

  constructor(private environmentStore: EnvironmentVariablesStore) {
    this.errorImage = `${this.environmentStore.APP_ASSETS_URL}/images/exclamation-sign.png`;
  }
}
