import { Component, OnInit } from '@angular/core';

import { COOKIES_USED } from '@feature-modules/policies/config/constants.config';


@Component({
  selector: 'app-policies-cookies-info',
  templateUrl: './cookies-info.component.html',
})
export class CookiesInfoComponent implements OnInit {

  cookiesUsed = COOKIES_USED.necessary;

  constructor() { }

  ngOnInit(): void { }

}
