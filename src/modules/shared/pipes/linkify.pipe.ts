import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'linkify'
})
export class LinkifyPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined): SafeHtml {
    if (!value) return '';

    // 1. Escape HTML to prevent XSS from raw user input
    let safeString = this.escapeHtml(value);

    // 2. Parse Markdown-style links: [Label](URL)
    // Matches: [something](http(s)://something)
    const markdownRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    safeString = safeString.replace(markdownRegex, (match, label, url) => {
      return `<a href="${url}" class="nhsuk-link" target="_blank" rel="noopener noreferrer">${label}</a>`;
    });

    // 3. Parse raw URLs (http or https) that are NOT already part of an anchor tag
    // Uses a negative lookbehind to ensure we don't match URLs inside our freshly created <a href="..."> tags
    // (JavaScript lookbehinds are supported in modern browsers, but we can also use a simpler approach)
    const urlRegex = /(?<!href=")(https?:\/\/[^\s<]+)/g;
    safeString = safeString.replace(urlRegex, (match, url) => {
      // If the URL matched looks like part of the markdown regex we just processed, it might be skipped if we did it right.
      // But let's be safe. If it's already inside an 'href', the negative lookbehind skips it.
      return `<a href="${url}" class="nhsuk-link" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    // 4. Return as trusted HTML
    return this.sanitizer.bypassSecurityTrustHtml(safeString);
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) {
      return map[m];
    });
  }
}
