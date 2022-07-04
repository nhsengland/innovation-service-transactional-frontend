import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';


import { Store } from '../store.class';
import { ContextModel } from './environment.models';
import { EnvironmentService } from './environment.service';
import { EnvironmentInnovationType } from './environment.types';
import { InnovationStatusEnum } from '../innovation/innovation.enums';

import { NotificationContextTypeEnum } from './environment.enums';


@Injectable()
export class EnvironmentStore extends Store<ContextModel> {

  constructor(
    private logger: NGXLogger,
    private environmentService: EnvironmentService
  ) { super('STORE::Environment', new ContextModel()); }


  innovation$(): Observable<ContextModel['innovation']> { return this.state$.pipe(map(item => item.innovation)); }
  notifications$(): Observable<ContextModel['notifications']> { return this.state$.pipe(map(item => item.notifications)); }


  // Notifications methods.
  updateUserUnreadNotifications(): void {

    this.environmentService.getUserUnreadNotifications().subscribe(
      response => {
        this.state.notifications.UNREAD = response.total;
        this.setState();
      },
      error => this.logger.error('Error obtaining user unread notifications', error)
    );

  }

  dismissNotification(contextType: NotificationContextTypeEnum, contextId: string): void {

    this.environmentService.dismissNotification(contextType, contextId).subscribe(
      () => this.updateUserUnreadNotifications(),
      error => this.logger.error('Error dismissing all user notifications', error)
    );

  }

  updateInnovationNotifications(): void {

    if (this.state.innovation?.id) {

      this.environmentService.getInnovationNotifications(this.state.innovation.id).subscribe(
        response => {
          this.state.innovation!.notifications = response.data;
          this.setState();
        },
        error => this.logger.error('Error obtaining innovation notifications', error)
      );
    }

  }


  // Innovation methods.
  getInnovation(): EnvironmentInnovationType {
    if (!this.state.innovation) {
      console.error('Context has NO innovation');
      return { id: '', name: '', status: InnovationStatusEnum.CREATED, owner: { isActive: false, name: '' } };
    }
    return this.state.innovation;
  }
  setInnovation(data: EnvironmentInnovationType): void {
    this.state.innovation = data;
    this.setState();
  }

  updateInnovation(data: Partial<EnvironmentInnovationType>): void {

    if (!this.state.innovation) {
      console.error('Context has NO innovation');
      return;
    }

    if (data.name) { this.state.innovation.name = data.name; }
    if (data.status) { this.state.innovation.status = data.status; }
    if (data.assessment) { this.state.innovation.assessment = data.assessment; }

    this.setState();

  }

}
