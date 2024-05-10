import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';

import { PageInnovationStatusListComponent } from './innovation-status-list.component';
import { RouterModule } from '@angular/router';

describe('Shared/Pages/Innovation/PageInnovationStatusListComponent', () => {
  let component: PageInnovationStatusListComponent;
  let fixture: ComponentFixture<PageInnovationStatusListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule, CoreModule, StoresModule, SharedModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageInnovationStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
