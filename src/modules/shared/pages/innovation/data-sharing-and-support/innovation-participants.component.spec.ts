import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, InnovationStore } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';

import { PageInnovationParticipantsComponent } from './innovation-participants.component';


describe('Shared/Pages/Innovation/Messages/PageInnovationThreadMessagesListComponent', () => {

  let activatedRoute: ActivatedRoute;

  let innovationStore: InnovationStore;

  let component: PageInnovationParticipantsComponent;
  let fixture: ComponentFixture<PageInnovationParticipantsComponent>;

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

    activatedRoute.snapshot.data = { innovationData: { id: 'Inno01', name: 'Innovation 01', assessment: {} } };

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(PageInnovationParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });

});
