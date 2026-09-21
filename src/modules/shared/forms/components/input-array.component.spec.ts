import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { FormInputComponent } from './input.component';
import { FormInputArrayV3Component, InnovationRecordItemType } from './input-array.component';

@Component({
  template: `
    <form [formGroup]="form">
      <theme-form-input-array-v3
        [groupName]="'certifications'"
        [items]="items"
        [relatedAnswers]="relatedAnswers"
      ></theme-form-input-array-v3>
    </form>
  `
})
class HostComponent {
  @ViewChild(FormInputArrayV3Component) childComponent?: FormInputArrayV3Component;

  form = new FormGroup({
    certifications: new FormGroup({ GMDN: new FormControl(null) })
  });

  relatedAnswers: Record<string, string> = {
    hasMet: 'IN_PROGRESS',
    standards: 'UK_MDR_CLASS_I'
  };

  items: InnovationRecordItemType[] = [
    {
      id: 'GMDN',
      label: 'GMDN',
      itemConditionOptions: {
        mandatoryIf: {
          groupLogic: 'AND',
          conditions: [
            { id: 'hasMet', list: ['YES'], relation: 'sibling' },
            { id: 'standards', list: ['UK_MDR_CLASS_I'], relation: 'parent' }
          ]
        }
      }
    }
  ];
}

describe('FormInputArrayV3Component', () => {
  let hostComponent: HostComponent;
  let hostFixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [HostComponent, FormInputComponent, FormInputArrayV3Component]
    });

    hostFixture = TestBed.createComponent(HostComponent);
    hostComponent = hostFixture.componentInstance;
  });

  it('recalculates requiredness when hasMet changes', () => {
    hostFixture.detectChanges();
    expect(hostComponent.form.get('certifications.GMDN')?.valid).toBe(true);

    hostComponent.relatedAnswers = { ...hostComponent.relatedAnswers, hasMet: 'YES' };
    hostFixture.detectChanges();

    expect(hostComponent.form.get('certifications.GMDN')?.hasError('required')).toBe(true);
  });

  it('recalculates requiredness when the selected standard changes', () => {
    hostFixture.detectChanges();
    hostComponent.relatedAnswers = { ...hostComponent.relatedAnswers, hasMet: 'YES', standards: 'OTHER' };
    hostFixture.detectChanges();
    expect(hostComponent.form.get('certifications.GMDN')?.valid).toBe(true);

    hostComponent.relatedAnswers = { ...hostComponent.relatedAnswers, standards: 'UK_MDR_CLASS_I' };
    hostFixture.detectChanges();

    expect(hostComponent.form.get('certifications.GMDN')?.hasError('required')).toBe(true);
  });

  it('keeps the label for an unconditional input item', () => {
    hostFixture.detectChanges();

    expect(hostComponent.childComponent?.getLabel({ id: 'REG_NUMBER', label: 'Registration number' })).toBe(
      'Registration number'
    );
  });
});
