import { Clipboard } from '@angular/cdk/clipboard';
import { Directive, HostListener, input } from '@angular/core';

@Directive({
  selector: '[appCopyToClipboard]'
})
export class CopyToClipboardDirective {
  copy = input.required<string>({ alias: 'appCopyToClipboard' });

  constructor(private clipboard: Clipboard) {}

  @HostListener('click', ['$event'])
  onClick(): void {
    this.clipboard.copy(this.copy());
  }
}
