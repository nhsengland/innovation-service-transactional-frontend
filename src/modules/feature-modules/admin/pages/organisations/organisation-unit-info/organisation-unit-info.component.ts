import { Component, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';

@Component({
  selector: 'app-admin-pages-organisations-unit-info',
  templateUrl: './organisation-unit-info.component.html'
})
export class PageOrganisationUnitInfoComponent extends CoreComponent implements OnInit {

  constructor() { 
    super();
    this.setPageTitle('Unit Information');
  }

  ngOnInit(): void {
  }

}
