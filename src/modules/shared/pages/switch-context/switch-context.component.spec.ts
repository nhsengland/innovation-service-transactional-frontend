import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '@modules/core';
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

    fixture = TestBed.createComponent(PageSwitchContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
