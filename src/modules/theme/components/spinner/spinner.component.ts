import { Component, Input } from '@angular/core';


@Component({
  selector: 'theme-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {

  @Input() type: 'determinate' | 'indeterminate' = 'indeterminate';
  @Input() size = 80; // In pixels.
  @Input() showMessage = true;
  @Input() message = 'Loading. Please wait...';
  @Input() cssClass = '';

}
