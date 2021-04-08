import { ActivatedRouteSnapshot } from '@angular/router';

export class RoutingHelper {

  // Returns all ActivatedRouteSnapshot parameters, including the ones from childrens.
  static getRouteParams(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot['params'] {
    return { ...route.params, ...route.children.reduce((acc: ActivatedRouteSnapshot['params'], child: ActivatedRouteSnapshot) => ({ ...RoutingHelper.getRouteParams(child), ...acc }), {}) };
  }

}
