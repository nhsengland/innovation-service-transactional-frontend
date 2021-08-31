import { ActivatedRoute } from '@angular/router';

import { RoutingHelper } from './routing.helper';


describe('Core/Helpers/RoutingHelper', () => {

  it(`should return all parameter from the route`, () => {

    const routeMock: Partial<ActivatedRoute> = {
      snapshot: {
        params: { idOne: '1', idTwo: '2' },
      } as any,
      children: [
        {
          snapshot: {
            params: { idThree: '3', idFour: '4' }
          },
          children: []
        }
      ] as any
    };

    const expected = { idOne: '1', idTwo: '2', idThree: '3', idFour: '4' };

    expect(RoutingHelper.getRouteParams(routeMock as any)).toEqual(expected);

  });

  it(`should return all data from the route`, () => {

    const routeMock: Partial<ActivatedRoute> = {
      snapshot: {
        data: { idOne: '1', idTwo: '2' },
      } as any,
      children: [
        {
          snapshot: {
            data: { idThree: '3', idFour: '4' }
          },
          children: []
        }
      ] as any
    };

    const expected = { idOne: '1', idTwo: '2', idThree: '3', idFour: '4' };

    expect(RoutingHelper.getRouteData(routeMock as any)).toEqual(expected);

  });

  it(`should resolve a url to empty when it's undefined`, () => {

    const routeMock: Partial<ActivatedRoute> = {
      snapshot: { params: { idOne: '1', idTwo: '2' }, children: [] } as any
    };

    const expected = '';

    expect(RoutingHelper.resolveUrl(undefined, routeMock as any)).toEqual(expected);

  });

  it(`should resolve a url with parameters replaced`, () => {

    const routeMock: Partial<ActivatedRoute> = {
      snapshot: { params: { idOne: '1', idTwo: '2' }, children: [] } as any,
      children: []
    };

    const expected = 'http://demo.com/path1/1/path2/2';

    expect(RoutingHelper.resolveUrl('http://demo.com/path1/:idOne/path2/:idTwo', routeMock as any)).toEqual(expected);

  });

});
