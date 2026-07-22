import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { CookiesService } from '@modules/core/services/cookies.service';
import { CtxStore } from '@modules/stores';

import { HeaderAdminComponent } from './header-admin.component';
import { HeaderMenuBarItemType } from './header.component';

@Component({ selector: 'theme-notification-tag', template: '' })
class NotificationTagStubComponent {}

describe('Theme/Components/Header/HeaderAdminComponent', () => {
  let component: HeaderAdminComponent;
  let fixture: ComponentFixture<HeaderAdminComponent>;

  beforeEach(() => {
    const user = {
      isAccessorType: jest.fn().mockReturnValue(false),
      getUserRoleTranslation: jest.fn().mockReturnValue('Innovator'),
      getAccessorUnitName: jest.fn().mockReturnValue('Test unit'),
      isStateLoaded: jest.fn().mockReturnValue(true),
      getDisplayName: jest.fn().mockReturnValue('Test User'),
      hasMultipleRoles: jest.fn().mockReturnValue(true),
      signOut: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HeaderAdminComponent, NotificationTagStubComponent],
      providers: [
        { provide: CookiesService, useValue: { shouldAskForCookies: jest.fn().mockReturnValue(false), setConsentCookie: jest.fn() } },
        { provide: CtxStore, useValue: { user } }
      ]
    });

    fixture = TestBed.createComponent(HeaderAdminComponent);
    component = fixture.componentInstance;
    component.leftMenuBarItems = [
      {
        id: 'first-parent',
        label: 'First parent',
        children: [{ label: 'First child', url: '/first-child' }]
      },
      {
        id: 'second-parent',
        label: 'Second parent',
        children: [{ label: 'Second child', url: '/second-child' }]
      },
      { id: 'router-link', label: 'Router link', url: '/router-link' },
      { id: 'full-reload-link', label: 'Full reload link', url: '/full-reload-link', fullReload: true }
    ];
    component.showUserInformation = true;
    component.showSignOut = true;
    fixture.detectChanges();
  });

  it('starts with navigation closed', () => {
    expect(component.navigationOpen).toBe(false);
  });

  it('toggles and closes navigation', () => {
    component.toggleNavigation();
    expect(component.navigationOpen).toBe(true);

    component.closeNavigation();
    expect(component.navigationOpen).toBe(false);
  });

  it('closes an open parent submenu when another parent submenu opens', () => {
    const [firstParent, secondParent] = component.leftMenuBarItems;

    component.onHeaderMenuClick(firstParent);
    component.onHeaderMenuClick(secondParent);

    expect(firstParent.isOpen).toBe(false);
    expect(secondParent.isOpen).toBe(true);
  });

  it('renders accessible navigation and submenu controls', () => {
    const menuButton = fixture.nativeElement.querySelector('#toggle-menu');
    const closeButton = fixture.nativeElement.querySelector('.app-admin-header__navigation-close');
    const submenuButton = fixture.nativeElement.querySelector('[aria-controls="admin-menu-first-parent"]');
    const submenu = fixture.nativeElement.querySelector('#admin-menu-first-parent');

    expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    expect(menuButton.getAttribute('aria-controls')).toBe('header-navigation');
    expect(closeButton.textContent).toContain('Close menu');
    expect(submenuButton.getAttribute('aria-controls')).toBe('admin-menu-first-parent');
    expect(submenu.hidden).toBe(true);
  });

  it('keeps service, account, role switch, sign-out, router and full reload links represented', () => {
    const links = Array.from(fixture.nativeElement.querySelectorAll('a')) as HTMLAnchorElement[];
    const linkByText = (text: string) => links.find(link => link.textContent?.trim() === text);

    expect(fixture.nativeElement.querySelector('.nhsuk-header__service-name').textContent).toContain('Innovation Service');
    expect(fixture.nativeElement.textContent).toContain('Test User ( Innovator )');
    expect(linkByText('Change role')?.getAttribute('ng-reflect-router-link')).toBe('/switch-user-context');
    expect(linkByText('Sign out')).toBeTruthy();
    expect(linkByText('Router link')?.getAttribute('ng-reflect-router-link')).toBe('/router-link');
    expect(linkByText('Full reload link')?.getAttribute('href')).toBe('/full-reload-link');
  });
});
