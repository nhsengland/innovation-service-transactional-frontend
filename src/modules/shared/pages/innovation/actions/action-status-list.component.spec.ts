import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';

import { PageActionStatusListComponent } from './action-status-list.component';


describe('Shared/Pages/Innovation/PageActionStatusListComponent', () => {

  let component: PageActionStatusListComponent;
  let fixture: ComponentFixture<PageActionStatusListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        SharedModule
      ],
      declarations: [
        PageActionStatusListComponent
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

  });


  it('should create the component', () => {

    fixture = TestBed.createComponent(PageActionStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });

});
