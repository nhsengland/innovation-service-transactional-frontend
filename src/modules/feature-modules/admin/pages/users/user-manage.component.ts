import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';

@Component({
  selector: 'app-admin-pages-users-user-manage',
  templateUrl: './user-manage.component.html'
})
export class PageUserManageComponent extends CoreComponent implements OnInit {
  isActive: boolean;
  isInnovator: boolean;

  constructor(private route: ActivatedRoute) {
    super();
    this.setPageTitle('Manage account');
    const user = this.route.snapshot.data.user;
    this.isActive = user.isActive;
    this.isInnovator = user.isInnovator;
  }

  ngOnInit(): void {
    this.setPageStatus('READY');
  }
}
