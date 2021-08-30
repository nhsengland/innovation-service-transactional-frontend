import * as parser from './parser';
import { PDFGenerator } from './PDFGenerator';
describe('PDF Parser Suite', () => {

  it ('should generate a PDF', async () => {
    // Arrange

    spyOn(parser, 'getInnovation').and.returnValue({
      id: '_innovation_id',
      name: '_innovation_name',
      company : '_innovation_company',
      countryName: '_innovation_country_name',
      postcode: '_innovation_postcode',
      actions:  [],
      comments: [],
      status: 'IN_PROGRESS',
    });


    spyOn(parser, 'getSections').and.returnValue([
      {
        section: {
          id: '_section_id',
          section: 'INNOVATION_DESCRIPTION',
          status: 'SUBMITTED',
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
          clinicalAreas: ['Clinical Area 1'],
          careSettings: ['Care settings 1'],
          supportTypes: ['Support type 1']
        }
      }
    ]);

    spyOn(PDFGenerator.prototype, 'addLogo');
    const spy = spyOn(PDFGenerator.prototype, 'save');
    // Act

    const actual = await parser.generatePDF('_innovation_id', '_user_id', { });

    // Assert

    expect(spy).toHaveBeenCalled();
  });
});
