import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { AdminUsersService } from '../../../services/users.service';

@Component({
  selector: 'app-admin-pages-users-strategic-role-inactivate',
  templateUrl: './strategic-role-inactivate.component.html'
})
export class PageStrategicRoleInactivateComponent extends CoreComponent implements OnInit {
  userId: string;
  strategicRoleId: string;
  user: any = null;
  roleToInactivate: any = null;
  submitButton = { isActive: true, label: 'Confirm inactivation' };

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: AdminUsersService
  ) {
    super();
    this.userId = this.activatedRoute.snapshot.params.userId;
    this.strategicRoleId = this.activatedRoute.snapshot.params.strategicRoleId;
    this.setBackLink('Go back', this.goBackOrCancel.bind(this));
  }

  ngOnInit(): void {
    this.usersService.getUserInfo(this.userId).subscribe({
      next: user => {
        this.user = user;
        this.roleToInactivate = user.strategicRoles.find((sr: any) => sr.id === this.strategicRoleId);
        if (!this.roleToInactivate) {
          this.redirectTo(`/admin/users/${this.userId}`);
          return;
        }
        this.setPageTitle('Inactivate strategic role');
        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
      }
    });
  }

  onSubmit(): void {
    this.submitButton = { isActive: false, label: 'Saving...' };
    this.usersService.deleteStrategicRole(this.userId, this.strategicRoleId).subscribe({
      next: () => {
        this.redirectTo(`/admin/users/${this.userId}`, { alert: 'strategicRoleDeletionSuccess' });
      },
      error: () => {
        this.submitButton = { isActive: true, label: 'Confirm inactivation' };
        this.setAlertUnknownError();
      }
    });
  }

  goBackOrCancel(): void {
    this.redirectTo(`/admin/users/${this.userId}`);
  }
}
