import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';

export class RoutingHelper {

  // Returns all ActivatedRouteSnapshot parameters, including the ones from childrens.
  static getRouteParams(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot['params'] {
    return { ...route.params, ...route.children.reduce((acc: ActivatedRouteSnapshot['params'], child: ActivatedRouteSnapshot) => ({ ...RoutingHelper.getRouteParams(child), ...acc }), {}) };
  }

  // Returns all ActivatedRouteSnapshot data, including the ones from childrens.
  static getRouteData(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot['data'] {
    return { ...route.data, ...route.children.reduce((acc: ActivatedRouteSnapshot['data'], child: ActivatedRouteSnapshot) => ({ ...RoutingHelper.getRouteData(child), ...acc }), {}) };
  }

  // Returns a url with all parameters replaced.
  static resolveUrl(url: string | undefined | null, route: ActivatedRoute): string {

    if (!url) { return ''; }

    for (const [key, value] of Object.entries(RoutingHelper.getRouteParams(route.snapshot))) {
      url = url.replace(`:${key}`, value);
    }

    return url;

  }

}
