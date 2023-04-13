import { NgModule } from '@angular/core';

import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { HomeRoutingModule } from './home-routing.module';

// Pages.
import { HomeComponent } from './home.component';
import { HomeLayoutComponent } from './base/home-layout.component';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    HomeRoutingModule,
  ],
  declarations: [
    HomeLayoutComponent,
    HomeComponent
  ]
})
export class HomeModule { }
