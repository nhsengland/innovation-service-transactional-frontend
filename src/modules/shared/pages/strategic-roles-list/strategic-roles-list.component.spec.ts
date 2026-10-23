import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { PageStrategicRolesListComponent } from './strategic-roles-list.component';

jest.mock('../../services/users.service', () => ({ UsersService: class {} }));

jest.mock('@app/base', () => ({
  CoreComponent: class {
    setPageTitle = jest.fn();
    setPageStatus = jest.fn();
    pageStatus() {
      return 'READY';
    }
  }
}));

describe('Champions and senior sponsors table', () => {
  it('shows separate unit rows, hides matching unit names and keeps contacts together', async () => {
    const rows = [
      {
        organisation: { id: 'network', name: 'Network' },
        organisationUnit: { id: 'london', name: 'London' },
        champions: [{ name: 'Alice', email: 'alice@test.com' }],
        seniorSponsors: [{ name: 'Bob', email: 'bob@test.com' }]
      },
      {
        organisation: { id: 'network', name: 'Network' },
        organisationUnit: { id: 'manchester', name: 'Manchester' },
        champions: [{ name: 'Carol', email: 'carol@test.com' }],
        seniorSponsors: []
      },
      {
        organisation: { id: 'other', name: 'Other' },
        organisationUnit: { id: 'other-unit', name: 'Other' },
        champions: [],
        seniorSponsors: []
      }
    ];
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [PageStrategicRolesListComponent],
      providers: [{ provide: UsersService, useValue: { getStrategicRolesList: () => of(rows) } }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    const fixture = TestBed.createComponent(PageStrategicRolesListComponent);
    fixture.detectChanges();
    const table: HTMLTableElement = fixture.nativeElement.querySelector('table');
    expect(Array.from(table.querySelectorAll('th'), th => th.textContent?.trim())).toEqual([
      'Organisation',
      'Unit',
      'Champion details',
      'Senior sponsor details'
    ]);
    const bodyRows = Array.from(table.querySelectorAll('tbody tr'));
    expect(bodyRows).toHaveLength(3);
    expect(bodyRows[0].children[1].textContent?.trim()).toBe('London');
    expect(bodyRows[0].textContent).toContain('Alice');
    expect(bodyRows[0].textContent).toContain('Bob');
    expect(bodyRows[1].children[1].textContent?.trim()).toBe('Manchester');
    expect(bodyRows[1].textContent).toContain('Carol');
    expect(bodyRows[1].textContent).toContain('No Senior Sponsor assigned');
    expect(bodyRows[1].textContent).not.toContain('Bob');
    expect(bodyRows[2].children[1].textContent?.trim()).toBe('');
  });
});
