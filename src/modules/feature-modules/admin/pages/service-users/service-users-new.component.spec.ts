import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';

import { PageServiceUsersNewComponent } from './service-users-new.component';


describe('FeatureModules/Admin/Pages/ServiceUsers/PageServiceUsersNewComponent', () => {

  let component: PageServiceUsersNewComponent;
  let fixture: ComponentFixture<PageServiceUsersNewComponent>;

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
    fixture = TestBed.createComponent(PageServiceUsersNewComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
