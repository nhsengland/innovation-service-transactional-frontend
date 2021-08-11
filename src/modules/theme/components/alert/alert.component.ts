import { Component, Input } from '@angular/core';


@Component({
  selector: 'theme-alert',
  templateUrl: './alert.component.html'
})
export class AlertComponent {

  @Input() set type(value: null | '' | 'INFORMATION' | 'SUCCESS' | 'WARNING' | 'ERROR') {
    this.componentType = value;
    switch (value) {
      case 'INFORMATION': this.borderColorCSS = 'border-color-primary'; break;
      case 'SUCCESS': this.borderColorCSS = 'border-color-success'; break;
      case 'WARNING': this.borderColorCSS = 'border-color-warning'; break;
      case 'ERROR': this.borderColorCSS = 'border-color-error'; break;
      case null:
      case '':
      default:
        this.borderColorCSS = '';
        break;
    }
  }
  @Input() title?: string;
  @Input() message?: string;

  componentType: null | '' | 'INFORMATION' | 'SUCCESS' | 'WARNING' | 'ERROR' = '';

  borderColorCSS = '';


  constructor() { }


}
