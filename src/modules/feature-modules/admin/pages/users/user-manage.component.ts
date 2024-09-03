import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { UsersService } from '@modules/shared/services/users.service';
import { MFAInfoDTO } from '@modules/stores/authentication/authentication.service';

@Component({
  selector: 'app-admin-pages-users-user-manage',
  templateUrl: './user-manage.component.html'
})
export class PageUserManageComponent extends CoreComponent implements OnInit {
  isActive: boolean;
  isInnovator: boolean;
  userId: string;

  MFAInfo: MFAInfoDTO | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UsersService
  ) {
    super();
    this.setPageTitle('Manage account');
    const user = this.route.snapshot.data.user;
    this.isActive = user.isActive;
    this.isInnovator = user.isInnovator;
    this.userId = user.id;
  }

  ngOnInit(): void {
    this.userService
      .getUserMFAInfo(this.userId)()
      .subscribe({
        next: response => {
          this.MFAInfo = response;
          this.setPageStatus('READY');
        }
      });
  }
}
