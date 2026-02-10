import { Pipe, PipeTransform } from '@angular/core';
import { StrategicRoleEnum } from '@app/base/enums';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'strategicRoleTranslate' })
export class StrategicRoleTranslatePipe implements PipeTransform {
  constructor(private readonly translateService: TranslateService) {}

  transform(role: StrategicRoleEnum): string {
    if (role in StrategicRoleEnum) {
      return this.translateService.instant(`strategicRoles.${role}`);
    }
    return 'Unknown strategic role';
  }
}
