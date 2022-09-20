import { InnovationSectionEnum } from '@modules/stores/innovation';
import * as parser from './parser';
import { PDFGenerator } from './PDFGenerator';

describe('PDF Parser Suite', () => {

  it('should generate a PDF', async () => {

    jest.spyOn(parser, 'getInnovation').mockReturnValue(Promise.resolve({
      id: '_innovation_id',
      name: '_innovation_name',
      company: '_innovation_company',
      description: '',
      countryName: '_innovation_country_name',
      postcode: '_innovation_postcode',
      actions: [],
      comments: []
    }));


    jest.spyOn(parser, 'getSections').mockReturnValue(Promise.resolve([
      {
        section: {
          id: '_section_id',
          section: InnovationSectionEnum.CURRENT_CARE_PATHWAY,
          status: 'SUBMITTED',
          actionStatus: 'REQUESTED',
          updatedAt: ''
        },
        data: {
          description: 'innovation description',
          otherMainCategoryDescription: null,
          otherCategoryDescription: null,
          mainCategory: 'MEDICAL_DEVICE',
          hasFinalProduct: 'YES',
          mainPurpose: 'MANAGE_CONDITION',
          categories: ['Category 1', 'Category 2'],
          areas: ['Area 1', 'Area 2'],
          careSettings: ['Care settings 1'],
          supportTypes: ['Support type 1']
        }
      }
    ]));

    jest.spyOn(PDFGenerator.prototype, 'addLogo');
    const spy = jest.spyOn(PDFGenerator.prototype, 'save');

    await parser.generatePDF('_innovation_id', '_user_id', {});

    expect(spy).toHaveBeenCalled();

  });

  it('should throw Innovation exception', async () => {

    jest.spyOn(parser, 'getInnovation').mockRejectedValue('');
    const spy = jest.spyOn(PDFGenerator.prototype, 'save');
    let err;

    try {
      await parser.generatePDF('_innovation_id', '_user_id', {});
    } catch (error) {
      err = error;
    }

    expect((err as any).name).toBe('PDFGeneratorInnovationNotFoundError');

  });

  it('should throw Sections exception', async () => {

    jest.spyOn(parser, 'getInnovation');
    jest.spyOn(parser, 'getSections').mockRejectedValue('');
    const spy = jest.spyOn(PDFGenerator.prototype, 'save');
    let err;

    try {
      await parser.generatePDF('_innovation_id', '_user_id', {});
    } catch (error) {
      err = error;
    }

    expect((err as any).name).toBe('PDFGeneratorInnovationNotFoundError');

  });

});
