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
});
