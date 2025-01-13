import { Clipboard } from '@angular/cdk/clipboard';
import { Directive, HostListener, input } from '@angular/core';

@Directive({
  selector: '[appCopyToClipboard]'
})
export class CopyToClipboardDirective {
  copy = input.required<string | null | undefined>({ alias: 'appCopyToClipboard' });

  constructor(private clipboard: Clipboard) {}

  @HostListener('click', ['$event'])
  onClick(): void {
    const value = this.copy();
    if (value) {
      this.clipboard.copy(value);
    }
  }
}
