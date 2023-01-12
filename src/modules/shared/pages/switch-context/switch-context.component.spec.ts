import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppInjector, CoreModule } from '@modules/core';
import { SharedModule } from '@modules/shared/shared.module';
import { StoresModule } from '@modules/stores';

import { PageSwitchContextComponent } from './switch-context.component';

describe('Shared/Pages/PageSwitchContextComponent', () => {
  let component: PageSwitchContextComponent;
  let fixture: ComponentFixture<PageSwitchContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageSwitchContextComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        SharedModule
      ]
    })
    .compileComponents();

    AppInjector.setInjector(TestBed.inject(Injector));

    fixture = TestBed.createComponent(PageSwitchContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
