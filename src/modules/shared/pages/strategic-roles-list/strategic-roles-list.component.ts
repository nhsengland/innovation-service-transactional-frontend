import { Component, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-shared-pages-strategic-roles-list',
  templateUrl: './strategic-roles-list.component.html'
})
export class PageStrategicRolesListComponent extends CoreComponent implements OnInit {
  strategicRolesList: {
    organisation: { id: string; name: string };
    champions: { name: string; email: string }[];
    seniorSponsors: { name: string; email: string }[];
  }[] = [];

  constructor(private usersService: UsersService) {
    super();
    this.setPageTitle('Champions and senior sponsors');
  }

  ngOnInit(): void {
    this.usersService.getStrategicRolesList().subscribe({
      next: response => {
        this.strategicRolesList = response;
        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }
}
