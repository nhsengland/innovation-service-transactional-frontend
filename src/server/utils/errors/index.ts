export class PDFGeneratorParserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PDFGeneratorParserError';
  }
}

export class PDFGeneratorSectionsNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PDFGeneratorSectionsNotFoundError';
  }
}

export class PDFGeneratorInnovationNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PDFGeneratorInnovationNotFoundError';
  }
}

export class CSVGeneratorParserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CSVGeneratorParserError';
  }
}

export class CSVGeneratorSectionsNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CSVGeneratorSectionsNotFoundError';
  }
}

export class CSVGeneratorInnovationNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CSVGeneratorInnovationNotFoundError';
  }
}

