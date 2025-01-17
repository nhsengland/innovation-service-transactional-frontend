import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CoreComponent } from '@app/base';

@Component({
  selector: 'app-innovation-record-export',
  templateUrl: './innovation-record-export.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InnovationRecordExportComponent extends CoreComponent {
  innovationId = input.required<string>();
  fileType = input.required<'csv' | 'pdf'>();
  button = input<boolean>(false);
  customLabel = input<string>();
  btnStyle = input<'primary' | 'secondary'>('primary');

  exportDocumentUrl = computed(() => {
    let url = `${this.CONSTANTS.APP_URL}/exports/${this.innovationId()}`;
    switch (this.fileType()) {
      case 'pdf':
        url += '/pdf';
        break;
      case 'csv':
        url += '/csv';
        break;
    }
    url += `?role=${this.ctx.user.getUserContext()?.roleId}`;
    url += `&uniqueId=${this.ctx.innovation.info().uniqueId}`;
    return url;
  });

  constructor() {
    super();
  }
}
