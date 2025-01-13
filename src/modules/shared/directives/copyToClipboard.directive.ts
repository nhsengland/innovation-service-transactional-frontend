import { Clipboard } from '@angular/cdk/clipboard';
import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appCopyToClipboard]'
})
export class CopyToClipboardDirective {
  @Input('appCopyToClipboard') copy: string | null | undefined;

  constructor(private clipboard: Clipboard) {}

  @HostListener('click', ['$event'])
  onClick(): void {
    if (this.copy) {
      this.clipboard.copy(this.copy);
    }
  }
}
