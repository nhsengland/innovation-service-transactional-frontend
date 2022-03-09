import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType, LinkType } from '@app/base/models';
import { RoutingHelper } from '@modules/core';

@Component({
  selector: 'app-admin-pages-admin-users-info',
  templateUrl: './admin-users-info.component.html'
})
export class PageAdminUsersInfoComponent extends CoreComponent implements OnInit {
  alert: AlertType = { type: null };

  user: { id: string, name: string };

  titleActions: LinkType[] = [];


  sections: {
    userInfo: { label: string; value: null | string; }[];
    innovations: string[];
    organisation: { label: string; value: null | string; }[];
  } = { userInfo: [], innovations: [], organisation: [] };

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
    super();
    this.setPageTitle('Admin User information');
    this.user = { id: this.activatedRoute.snapshot.params.userId, name: RoutingHelper.getRouteData(this.activatedRoute).user.displayName };

  }

  ngOnInit(): void {

    this.sections.userInfo = [
      { label: 'Name', value: 'Admin' },
      { label: 'Type', value: 'Admin' },
      { label: 'Email address', value: 'admin@admin.com' }
    ];
    this.setPageStatus('READY');
  }

}
