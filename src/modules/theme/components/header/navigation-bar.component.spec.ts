import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HeaderNavigationBarComponent } from './navigation-bar.component';
import { NotificationTagComponent } from '../notification-tag/notification-tag.component';

describe('Theme/Components/Header/NavigationBarComponent', () => {

  let component: HeaderNavigationBarComponent;
  let fixture: ComponentFixture<HeaderNavigationBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [
        HeaderNavigationBarComponent,
        NotificationTagComponent,
      ]
    });

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(HeaderNavigationBarComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
