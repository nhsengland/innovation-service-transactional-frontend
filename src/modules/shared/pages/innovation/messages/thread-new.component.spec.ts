import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { InnovationStore, StoresModule } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';

import { PageInnovationThreadNewComponent } from './thread-new.component';


describe('Shared/Pages/Innovation/Messages/PageInnovationThreadNewComponent', () => {

  let activatedRoute: ActivatedRoute;

  let innovationStore: InnovationStore;

  let component: PageInnovationThreadNewComponent;
  let fixture: ComponentFixture<PageInnovationThreadNewComponent>;

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

    activatedRoute = TestBed.inject(ActivatedRoute);

    innovationStore = TestBed.inject(InnovationStore);

    activatedRoute.snapshot.data = { module: 'innovator' };

  });


  it('should create the component', () => {

    fixture = TestBed.createComponent(PageInnovationThreadNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });

});
