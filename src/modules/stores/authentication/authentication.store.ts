import { Injectable } from '@angular/core';

import { Store } from '../store.class';

import { AuthenticationModel } from './authentication.models';

@Injectable()
export class AuthenticationStore extends Store<AuthenticationModel> {
  constructor() {
    super('store::authentication', new AuthenticationModel());
  }
}
