import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';

@Component({
  selector: 'app-admin-pages-users-user-manage',
  templateUrl: './user-manage.component.html'
})
export class PageUserManageComponent extends CoreComponent implements OnInit {
  @Input() isInnovator = false;
  @Input() isActive = false;

  user: any = {}; // TODO

  constructor(private route: ActivatedRoute) {
    super();
    this.setPageTitle('Manage account');
    this.user = this.route.snapshot.data.user;
    console.log(this.user);
  }

  ngOnInit(): void {
    this.setPageStatus('READY');
  }
}
