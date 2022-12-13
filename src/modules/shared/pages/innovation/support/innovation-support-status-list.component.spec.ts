import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { SharedModule } from '@modules/shared/shared.module';
import { PageInnovationSupportStatusListComponent } from './innovation-support-status-list.component';


describe('Shared/Pages/Innovation/PageInnovationSupportStatusListComponent', () => {

  let component: PageInnovationSupportStatusListComponent;
  let fixture: ComponentFixture<PageInnovationSupportStatusListComponent>;

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

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(PageInnovationSupportStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });

});
