import { jsPDF } from 'jspdf';
import * as fs from 'fs';
import { resolve } from 'path';

export class PDFGenerator {
  private currentPosition = 0;
  private documentHeight = 0;
  private doc: jsPDF;
  private pageWidth = 8.5; // 8.5 inches;
  private lineHeight = 1.2;
  private margin = 0.5;
  private maxLineWidth = this.pageWidth - this.margin * 2;
  private pointPerInch = 72;

  private options: { margin: number; top: number; lineSpacing: number; maxLen: number };

  currentPage = 0;
  constructor(opts?: { margin: number; top: number; lineSpacing: number; maxLen: number }) {
    opts = opts || {
      margin: 0.59,
      top: 0.58,
      lineSpacing: 0.39,
      maxLen: 7
    };

    this.currentPosition = opts.top || 0.98;

    const doc = new jsPDF({
      unit: 'in'
    }).setProperties({ title: 'Innovation Record Export' });

    doc.setLineHeightFactor(this.lineHeight);

    this.documentHeight = doc.internal.pageSize.getHeight();

    this.doc = doc;
    this.options = opts;
  }

  private addBoldText(text: string, fontSize?: number, opts?: any): PDFGenerator {
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(opts.color || '#000');

    if (this.currentPosition >= this.documentHeight - 2) {
      this.addPage();
      this.currentPosition = this.options.top;
    }

    if (fontSize) {
      this.doc.setFontSize(fontSize);
    }

    const oneLineHeight = ((fontSize || 24) * this.lineHeight) / this.pointPerInch;

    const t = this.doc
      .setFont('helvetica')
      .setFontSize(fontSize || 24)
      .splitTextToSize(text, this.maxLineWidth);

    this.doc.text(t, this.margin, this.currentPosition);

    const blockHeight = t.length * oneLineHeight + 0.29;
    this.currentPosition += blockHeight + 0.19;

    if (t.length === 1) {
      this.currentPosition -= 0.19;
    }

    return this;
  }

  private addText(text: string, fontSize?: number, opts?: any): PDFGenerator {
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(opts.color || '#000');

    if (this.currentPosition >= this.documentHeight - 2) {
      this.addPage();
      this.currentPosition = this.options.top;
    }

    if (fontSize) {
      this.doc.setFontSize(fontSize);
    }

    const oneLineHeight = ((fontSize || 24) * this.lineHeight) / this.pointPerInch;

    const t = this.doc.setFont('helvetica').splitTextToSize(text, this.maxLineWidth);

    // check if current text of block will overflow the page vertically
    const blockHeight = t.length * oneLineHeight + 0.29;

    const parts: string[][] = [];

    // Potentially make this a recursive function

    if (this.currentPosition + blockHeight > this.documentHeight) {
      // initial height is the same as the instigator text block
      let heigth = blockHeight;
      // initial length is the same as the instigator array with split text block
      let length = t.length;

      // initializes temporary array of text with instigator text block array
      let tempT = [...t];

      // while the text size is higher than 90% of the document size
      // text size is the sum of the text block height plus its current position on the document.
      // if this sum is larger than 90% of the static document size, then we need to split the text
      // so that it goes on the next page.
      while (this.currentPosition + heigth > this.documentHeight * 0.9) {
        length--;

        // remove one line from the original array
        // add that line to a new array of "excluded" lines

        const range = tempT.slice(0, length);
        const excluded = tempT.slice(length);

        // calculate the new text height
        const tempHeight = range.length * oneLineHeight + 0.29;

        // check if the current position plus the text height is still higher than 90% of the document size
        if (this.currentPosition + tempHeight < this.documentHeight * 0.9) {
          // the new height is smaller than 90% of the document.
          // add that part to the output array
          parts.push(range);

          // calculate the position of the part
          const tempPosition = this.currentPosition + (tempHeight + 0.19);

          // calculate the height of the excluded lines array
          const excludedHeigth = excluded.length * oneLineHeight + 0.29;

          // if the virtual position of the part plus the excluded text heigh is higher than 90% of the document height
          if (tempPosition + excludedHeigth > this.documentHeight * 0.9) {
            // the new temporary array is now the excluded lines because they also overflow 90% of a document height
            tempT = [...excluded];
            // the new height is the sum of the virtua position of the part plus the excluded lines height
            heigth = tempPosition + excludedHeigth;
          } else {
            // the virtual position of the part plus the excluded text height fits on a single page
            // add the excluded lines part
            parts.push(excluded);
            // the height is the position
            heigth = excludedHeigth;
          }
        } else {
          heigth = tempHeight;
        }
      }
    } else {
      parts.push(t);
    }

    for (const element of parts) {
      this.doc.text(element, this.margin, this.currentPosition);
      const tempHeight = element.length * oneLineHeight + 0.29;
      this.currentPosition += tempHeight + 0.19;

      if (this.currentPosition + tempHeight > this.documentHeight) {
        this.addPage();
        this.currentPosition = this.options.top;
      }
    }

    return this;
  }

  addPage(): PDFGenerator {
    this.doc.addPage();
    this.currentPosition = this.options.top;
    this.currentPage++;
    this.addFooter(this.currentPage);
    return this;
  }

  addLogo(): PDFGenerator {
    const imagePath = `${resolve('./src/assets/images/nhs-logo.png')}`;
    const png = fs.readFileSync(imagePath);
    const imgStr = Buffer.from(png).toString('base64');
    this.doc.addImage(imgStr, 'png', this.pageWidth - 3, this.margin, 1.75, 0.75);

    return this;
  }

  addFooter(page: number): PDFGenerator {
    const prevSize = this.doc.getFontSize();
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`${page} | Innovation record`, this.margin, this.documentHeight - 1);
    this.doc.setFontSize(prevSize);
    return this;
  }

  save(): ArrayBuffer {
    return this.doc.output('arraybuffer');
  }

  addVerticalSpace(amount: number): PDFGenerator {
    this.currentPosition += amount;
    return this;
  }

  hero(innovationName: string): PDFGenerator {
    this.currentPosition = this.documentHeight / 2 - 3.2;
    this.addText('Innovation record export', 48, { color: '#005eb7' }).addVerticalSpace(0.19);
    this.addText(innovationName, 24, { color: '#005eb7' }).addVerticalSpace(0.39);
    this.addText('NHS Innovation Service', 18, { color: '#585858' });

    const d = new Date();
    const date =
      [d.getDate(), d.toLocaleDateString('en-GB', { month: 'long' }), d.getFullYear()].join(' ') +
      ' at ' +
      [d.getHours(), d.getMinutes()].join(':');

    this.addText(`Exported: ${date}`, 18, { color: '#585858' });

    return this;
  }

  h1(text: string): PDFGenerator {
    this.addBoldText(text, 30, { color: '#005eb7' }).addVerticalSpace(0.29);
    return this;
  }

  h2(text: string): PDFGenerator {
    this.addBoldText(text, 18, { color: '#212b31' }).addVerticalSpace(0.19);
    return this;
  }

  h3(text: string): PDFGenerator {
    this.addBoldText(text, 14, { color: '#212b31' });
    return this;
  }

  p(text: string): PDFGenerator {
    this.addText(text, 10, { color: '#212b31' });
    return this;
  }
}
