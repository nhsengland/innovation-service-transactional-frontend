import { AfterViewInit, Directive, ElementRef, Input, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements AfterViewInit {
  @Input() searchTerm?: string | string[];

  constructor(
    private el: ElementRef,
    private sanitizer: DomSanitizer
  ) {}

  ngAfterViewInit() {
    if (this.searchTerm) {
      const processedSearchTerm = Array.isArray(this.searchTerm)
        ? this.searchTerm
        : this.searchTerm.split(' ').filter(word => word !== ' ');

      if (processedSearchTerm?.length) {
        this.highlight(processedSearchTerm);
      }
    }
  }

  private highlight(processedSearchTerm: string[]): void {
    const htmlElement = this.el.nativeElement as HTMLElement;
    const text = htmlElement.textContent;

    if (text) {
      let newText = text;
      processedSearchTerm.forEach(term => {
        // Escape special characters from regular expressions
        const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Assert that what immediately precedes/follows the current position in the string is not a word character (\w). This helps in ensuring that the search term is not part of a larger word
        const regex = new RegExp(`(?<![\\w])${escapedTerm}(?![\\w])`, 'gi');
        // If a word from the search term exists in the htmlElement text, highlight it
        newText = newText.replace(regex, (match: string) => {
          return `<mark class="highlight">${match}</mark>`;
        });
      });

      const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, newText) ?? text;
      htmlElement.innerHTML = sanitized;
    }
  }
}
