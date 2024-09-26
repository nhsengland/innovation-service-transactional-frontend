import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { ServiceUserData } from '../../resolvers/service-user-data.resolver';
import { AdminUsersService } from '../../services/users.service';

@Component({
  selector: 'app-admin-pages-users-user-innovations',
  templateUrl: './user-innovations.component.html'
})
export class PageUserInnovationsComponent extends CoreComponent implements OnInit {
  innovations: { name: string; id: string }[] = [];
  user: ServiceUserData;

  constructor(
    private route: ActivatedRoute,
    private usersService: AdminUsersService
  ) {
    super();
    this.setPageTitle('User innovations');
    this.user = this.route.snapshot.data.user;
  }

  ngOnInit(): void {
    this.usersService.getInnovationsByInnovatorId(this.user.id).subscribe(innovations => {
      this.innovations = innovations;
      this.setPageStatus('READY');
    });
  }
}
