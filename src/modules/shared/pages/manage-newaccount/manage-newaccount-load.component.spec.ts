import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Injector } from '@angular/core';
import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { SharedModule } from '@shared-module/shared.module';
import { PageAccountManageUserAccountNewComponent } from './manage-newaccount-load.component';
describe('shared/Managenewaccount/PageAccountManageUserAccountNewComponent', () => {

    let component: PageAccountManageUserAccountNewComponent;
    let fixture: ComponentFixture<PageAccountManageUserAccountNewComponent>;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          RouterTestingModule,
          CoreModule,
          StoresModule,
          SharedModule
        ]
      });

      AppInjector.setInjector(TestBed.inject(Injector));

      fixture = TestBed.createComponent(PageAccountManageUserAccountNewComponent);
      component = fixture.componentInstance;

    });

    it('should create the component', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

  });
