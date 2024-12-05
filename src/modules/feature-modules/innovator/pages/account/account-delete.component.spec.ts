import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { PageAccountDeleteComponent } from './account-delete.component';
import { RouterModule } from '@angular/router';

describe('FeatureModules/Innovator/Pages/Account/PageAccountDeleteComponent', () => {
  let component: PageAccountDeleteComponent;
  let fixture: ComponentFixture<PageAccountDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, InnovatorModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAccountDeleteComponent);
    component = fixture.componentInstance;
    component.form.get('email')?.setValue('some@email.com');
    component.form.get('confirmation')?.setValue('delete my account');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
