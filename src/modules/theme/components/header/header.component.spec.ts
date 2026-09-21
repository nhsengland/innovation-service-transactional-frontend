import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CookiesService } from '@modules/core/services/cookies.service';
import { CtxStore } from '@modules/stores';

import { HeaderComponent } from './header.component';

@Component({
  selector: 'theme-notification-tag',
  template: '<span class="test-notification-tag">{{ label }}</span>'
})
class NotificationTagStubComponent {
  @Input() label: number | string = '';
}

describe('Theme/Components/Header/HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HeaderComponent, NotificationTagStubComponent],
      providers: [
        {
          provide: CookiesService,
          useValue: { shouldAskForCookies: jest.fn().mockReturnValue(false), setConsentCookie: jest.fn() }
        },
        { provide: CtxStore, useValue: { user: {} } }
      ]
    });

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('renders the unread notification badge for a notification menu item', () => {
    component.menuBarItems = [{ id: 'notifications', label: 'Notifications', url: '/notifications' }];
    component.notifications = { notifications: 3 };

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.test-notification-tag')?.textContent).toContain('3');
  });
});
