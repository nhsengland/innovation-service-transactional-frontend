import { jsPDF } from 'jspdf';

export class PDFGenerator {

  private currentPosition = 0;
  private documentHeight = 0;
  private doc: jsPDF;

  private options: {margin: number, top: number, lineSpacing: number, maxLen: number};

  constructor(opts?: {margin: number, top: number, lineSpacing: number, maxLen: number}) {
    opts = opts || {
      margin: 15,
      top: 25,
      lineSpacing: 10,
      maxLen: 180,
    };

    this.currentPosition = opts.top || 25;
    const doc = new jsPDF();
    this.documentHeight = doc.internal.pageSize.getHeight();

    this.doc = doc;
    this.options = opts;
  }

  addVerticalSpace(amount: number): PDFGenerator {
    this.currentPosition += amount;
    return this;
  }

  addBoldText(text: string, fontSize?: number, opts?: any): PDFGenerator {
    this.doc.setFont('times', 'bold');
    if (this.currentPosition >= this.documentHeight - (this.documentHeight * 0.10)) {
      this.doc.addPage();
      this.currentPosition = this.options.top;
    }

    const t = this.doc.splitTextToSize(text, 120);
    if (fontSize) { this.doc.setFontSize(fontSize); }


    this.doc.text(t, this.options.margin, this.currentPosition);
    this.currentPosition += (this.options.lineSpacing || 10);
    return this;
  }

  addText(text: string, fontSize?: number, opts?: any): PDFGenerator {
    this.doc.setFont('times', 'normal');
    if (this.currentPosition >= this.documentHeight - (this.documentHeight * 0.10)) {
      this.doc.addPage();
      this.currentPosition = this.options.top;
    }

    const t = this.doc.splitTextToSize(text, 120);
    if (fontSize) { this.doc.setFontSize(fontSize); }

    this.doc.text(t, this.options.margin, this.currentPosition);
    this.currentPosition += (this.options.lineSpacing || 10);
    return this;
  }

  save(): ArrayBuffer {
    return this.doc.output('arraybuffer');
  }
}
