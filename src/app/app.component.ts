import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { locale as enLanguage } from './config/translations/en';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  titleService: Title;
  translateService: TranslateService;

  constructor(
     titleService: Title,
     translateService: TranslateService
  ) {
    this.titleService = titleService;
    this.translateService = translateService;

    this.translateService.addLangs(['en']);
    this.translateService.setTranslation(enLanguage.lang, enLanguage.data, true);
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');

    this.titleService.setTitle(translateService.instant('app.title'));

  }

  ngOnInit(): void { }

}
