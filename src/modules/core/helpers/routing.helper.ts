import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

export class RoutingHelper {

  // Returns all ActivatedRouteSnapshot parameters, including the ones from childrens.
  static getRouteParams(route: ActivatedRoute): ActivatedRouteSnapshot['params'] {
    return { ...route.snapshot.params, ...route.children.reduce((acc: ActivatedRouteSnapshot['params'], child: ActivatedRoute) => ({ ...RoutingHelper.getRouteParams(child), ...acc }), {}) };
  }

  // Returns all ActivatedRouteSnapshot data, including the ones from childrens.
  static getRouteData<T>(route: ActivatedRoute): T {
    return {
      ...route.snapshot.data as T,
      ...route.children.reduce((acc: T, child: ActivatedRoute) => ({ ...RoutingHelper.getRouteData<T>(child), ...acc }), {} as T)
    };
  }

  // Returns a url with all parameters replaced.
  static resolveUrl(url: string | undefined | null, route: ActivatedRoute): string {

    if (!url) { return ''; }

    for (const [key, value] of Object.entries(RoutingHelper.getRouteParams(route))) {
      url = url.replace(`:${key}`, value);
    }

    return url;

  }

}
