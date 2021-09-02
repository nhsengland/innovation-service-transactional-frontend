import { jsPDF } from 'jspdf';
import fs from 'fs';
import path, { join } from 'path';
import { VIEWS_PATH } from 'src/server/config/constants.config';

export class PDFGenerator {

  private currentPosition = 0;
  private documentHeight = 0;
  private doc: jsPDF;
  private pageWidth = 8.5; // 8.5 inches;
  private lineHeight = 1.2;
  private margin = 0.5;
  private maxLineWidth = this.pageWidth - this.margin * 2;
  private pointPerInch = 72;


  private options: {margin: number, top: number, lineSpacing: number, maxLen: number};

  currentPage = 0;
  constructor(opts?: {margin: number, top: number, lineSpacing: number, maxLen: number}) {
    opts = opts || {
      margin: 0.59,
      top: 0.58,
      lineSpacing: 0.39,
      maxLen: 7,
    };

    this.currentPosition = opts.top || 0.98;

    const doc = new jsPDF({
      unit: 'in',
    }).setProperties({title: 'Innovation Record Export'});

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

    if (fontSize) { this.doc.setFontSize(fontSize); }

    const oneLineHeight = ((fontSize || 24) * this.lineHeight) / this.pointPerInch;

    const t = this.doc
      .setFont('helvetica')
      .setFontSize(fontSize || 24)
      .splitTextToSize(text, this.maxLineWidth);

    const blockHeight = (t.length * oneLineHeight) + 0.19;

    this.currentPosition += blockHeight;

    this.doc.text(t, this.margin, this.currentPosition);

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

    if (fontSize) { this.doc.setFontSize(fontSize); }
    const oneLineHeight = ((fontSize || 24) * this.lineHeight) / this.pointPerInch;

    const t = this.doc
    .setFont('helvetica')
    .splitTextToSize(text, this.maxLineWidth);

    const blockHeight = (t.length * oneLineHeight) + 0.29;
    this.currentPosition += blockHeight;

    this.doc.text(t, this.margin, this.currentPosition);

    this.currentPosition += 0.19;

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
    const viewsFolder = join(process.cwd(), VIEWS_PATH);
    const imagePath = `${viewsFolder}/assets/images/nhs-logo.png`;
    const png = fs.readFileSync(imagePath);
    const imgStr = Buffer.from(png).toString('base64');
    this.doc.addImage(imgStr, 'png', this.pageWidth - 3, this.margin, 1.75, .75);

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

  hero( innovationName: string ): PDFGenerator {
    this.currentPosition = (this.documentHeight / 2) - 3.2;
    this
      .addText('Innovation record export', 48, {color : '#005eb7'})
      .addVerticalSpace(0.19);
    this
      .addText(innovationName, 24, {color : '#005eb7'})
      .addVerticalSpace(0.39);
    this
      .addText('NHS Innovation service', 18, {color: '#585858'});
      // .addVerticalSpace(0.19);

    const d = new Date();

    const date = [d.getDate(), d.toLocaleDateString('en-GB', {month: 'long'}), d.getFullYear()].join(' ') + ' at ' + [d.getHours(), d.getMinutes()].join(':');

    this
      .addText(`Exported: ${date}`, 18, {color: '#585858'});

    return this;
  }

  h1( text: string ): PDFGenerator {

    this
      .addBoldText(text, 30,  {color : '#005eb7'})
      .addVerticalSpace(0.29);

    return this;
  }

  h2( text: string ): PDFGenerator {

    this
      .addBoldText(text, 18, {color: '#212b31'})
      .addVerticalSpace(0.19);
    return this;
  }

  h3( text: string ): PDFGenerator {

    this
      .addBoldText(text, 14, {color: '#212b31'});

    return this;
  }

  p( text: string ): PDFGenerator {

    this
      .addText(text, 10, {color: '#212b31'});

    return this;
  }
}
