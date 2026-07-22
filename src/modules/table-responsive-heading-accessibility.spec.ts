export {};

declare const __dirname: string;
declare const require: (moduleName: string) => unknown;

type DirectoryEntry = {
  name: string;
  isDirectory: () => boolean;
};

const { readdirSync, readFileSync } = require('fs') as {
  readdirSync: (directory: string, options: { withFileTypes: true }) => DirectoryEntry[];
  readFileSync: (file: string, encoding: 'utf8') => string;
};
const { join } = require('path') as {
  join: (...paths: string[]) => string;
};

const sourceDirectory = join(__dirname, '..');

function htmlFilesIn(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);

    return entry.isDirectory() ? htmlFilesIn(path) : entry.name.endsWith('.html') ? [path] : [];
  });
}

describe('responsive table heading accessibility', () => {
  it('hides duplicate responsive heading spans from screen readers', () => {
    const headingSpans = htmlFilesIn(sourceDirectory).flatMap(file => {
      const html = readFileSync(file, 'utf8');
      return [...html.matchAll(/<span\b[^>]*nhsuk-table-responsive__heading[^>]*>/g)].map(([span]) => ({ file, span }));
    });

    expect(headingSpans.length).toBeGreaterThan(0);

    const visibleToScreenReaders = headingSpans.filter(({ span }) => !/\baria-hidden\s*=\s*["']true["']/.test(span));

    expect(visibleToScreenReaders).toEqual([]);
  });

  it('groups complex responsive cell content inside one inner element', () => {
    const complexCells = htmlFilesIn(sourceDirectory).flatMap(file => {
      const html = readFileSync(file, 'utf8');
      return [...html.matchAll(/<(?:td|th)\b[^>]*>([\s\S]*?)<\/(?:td|th)>/gi)]
        .filter(([, cell]) => /nhsuk-table-responsive__heading/.test(cell))
        .flatMap(([, cell]) => {
          const afterHeading = cell
            .replace(/^[\s\S]*?<span\b[^>]*nhsuk-table-responsive__heading[^>]*>[\s\S]*?<\/span>/i, '')
            .trim();
          const hasComplexContent = /<(?:a|button|div|p|ul|ol|li|theme-|app-)\b/i.test(afterHeading);
          const hasSingleWrapper = /^<(?:span|div)\b[^>]*>[\s\S]*<\/(?:span|div)\s*>$/i.test(afterHeading);

          return hasComplexContent && !hasSingleWrapper ? [{ file, cell: cell.trim() }] : [];
        });
    });

    expect(complexCells).toEqual([]);
  });
});
