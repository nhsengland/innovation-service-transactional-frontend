import { Injectable } from '@angular/core';

import { Store } from '../store.class';
import { ContextInnovationType, ContextModel } from './context.models';

import { InnovationStatusEnum } from '@modules/shared/enums/innovation.enums';


@Injectable()
export class ContextStore extends Store<ContextModel> {

  constructor(
  ) {
    super('store::context', new ContextModel());
  }


  getInnovation(): ContextInnovationType {
    if (!this.state.innovation) {
      console.error('Context has NO innovation');
      return { id: '', name: '', status: InnovationStatusEnum.CREATED, owner: { isActive: false, name: '' } };
    }
    return this.state.innovation;
  }
  setInnovation(data: ContextInnovationType): void {
    this.state.innovation = data;
  }

  updateInnovation(data: Partial<ContextInnovationType>): void {

    if (!this.state.innovation) {
      console.error('Context has NO innovation');
      return;
    }

    if (data.name) { this.state.innovation.name = data.name; }
    if (data.status) { this.state.innovation.status = data.status; }
    if (data.assessment) { this.state.innovation.assessment = data.assessment; }

  }

}
