import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';

import { PageTaskStatusListComponent } from './task-status-list.component';

describe('Shared/Pages/Innovation/PageTaskStatusListComponent', () => {
  let component: PageTaskStatusListComponent;
  let fixture: ComponentFixture<PageTaskStatusListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, CoreModule, StoresModule, SharedModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageTaskStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
