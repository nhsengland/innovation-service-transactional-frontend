import { Route } from '@angular/router';

import { routes as accessorRoutes } from '@modules/feature-modules/accessor/accessor-routing.module';
import { routes as announcementRoutes } from '@modules/feature-modules/announcements/announcement-routing.module';
import { routes as assessmentRoutes } from '@modules/feature-modules/assessment/assessment-routing.module';
import { routes as innovatorRoutes } from '@modules/feature-modules/innovator/innovator-routing.module';

type HeaderRouteData = {
  header?: {
    menuBarItems?: unknown;
  };
};

function findInvalidMenuBarItems(routes: Route[], parentPath = ''): string[] {
  return routes.flatMap(route => {
    const path = `${parentPath}/${route.path ?? ''}`;
    const data = route.data as HeaderRouteData | undefined;
    const menuBarItems = data?.header?.menuBarItems;
    const invalid = menuBarItems !== undefined && !Array.isArray(menuBarItems) ? [path] : [];

    return [...invalid, ...(route.children ? findInvalidMenuBarItems(route.children, path) : [])];
  });
}

describe('transactional header route data', () => {
  it('uses an array for every header menuBarItems value', () => {
    const invalidRoutes = findInvalidMenuBarItems([
      ...accessorRoutes,
      ...announcementRoutes,
      ...assessmentRoutes,
      ...innovatorRoutes
    ]);

    expect(invalidRoutes).toEqual([]);
  });
});
