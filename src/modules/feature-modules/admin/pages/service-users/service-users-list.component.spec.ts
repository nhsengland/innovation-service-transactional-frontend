import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { PageServiceUsersListComponent } from './service-users-list.component';


describe('FeatureModules/Admin/Pages/ServiceUsers/PageServiceUsersListComponent', () => {

  let component: PageServiceUsersListComponent;
  let fixture: ComponentFixture<PageServiceUsersListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AdminModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageServiceUsersListComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
