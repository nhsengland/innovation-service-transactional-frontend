import { ActivatedRouteSnapshot } from '@angular/router';

import { RoutingHelper } from './routing.helper';

describe('RoutingHelper', () => {

  it(`should return all parameter from the route`, () => {

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

  it(`should return all data from the route`, () => {

    const routeMock: Partial<ActivatedRouteSnapshot> = {
      data: { idOne: '1', idTwo: '2' },
      children: [
        {
          data: { idThree: '3', idFour: '4' },
          children: []
        }
      ] as any
    };

    const expected = { idOne: '1', idTwo: '2', idThree: '3', idFour: '4' };

    expect(RoutingHelper.getRouteData(routeMock as any)).toEqual(expected);

  });


});
