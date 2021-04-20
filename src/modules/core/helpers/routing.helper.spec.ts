import { ActivatedRouteSnapshot } from '@angular/router';

import { RoutingHelper } from './routing.helper';

describe('RoutingHelper', () => {

  it(`should return 'true' when object is 'empty'`, () => {

    const routeMock: Partial<ActivatedRouteSnapshot> = {
      params: { idOne: '1', idTwo: '2' },
      children: [
        {
          params: { idThree: '3', idFour: '4' },
          children: []
        }
      ] as any
    };

    const expected = { idOne: '1', idTwo: '2', idThree: '3', idFour: '4' };

    expect(RoutingHelper.getRouteParams(routeMock as any)).toEqual(expected);

  });

});
