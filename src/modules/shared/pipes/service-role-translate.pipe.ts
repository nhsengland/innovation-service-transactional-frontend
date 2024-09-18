import { Pipe, PipeTransform } from '@angular/core';
import { UserRoleEnum } from '@app/base/enums';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'serviceRoleTranslate' })
export class ServiceRoleTranslatePipe implements PipeTransform {
  constructor(private readonly translateService: TranslateService) {}

  transform(role: UserRoleEnum): string {
    if (role in UserRoleEnum) {
      return this.translateService.instant(`roles.${role}`);
    }
    return 'Unknown role';
  }
}
