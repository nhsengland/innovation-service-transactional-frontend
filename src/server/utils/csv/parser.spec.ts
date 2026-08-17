import { UserRoleEnum } from '@app/base/enums';

import { generateCSV } from './parser';
import * as pdfParser from '../pdf/parser';

jest.mock('@modules/stores/innovation/innovation-record/ir-versions.config', () => ({
  getAllSectionsSummaryV3: jest.fn(() => [])
}));

jest.mock('../pdf/parser', () => ({
  getIRDocumentExportData: jest.fn(() => ({ sections: [] })),
  getInnovationInfo: jest.fn(),
  getProgressInfo: jest.fn(),
  getSchema: jest.fn(),
  getSections: jest.fn()
}));

jest.mock('axios', () => ({
  post: jest.fn().mockResolvedValue({ data: Buffer.from('csv') })
}));

describe('generateCSV', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(pdfParser.getInnovationInfo).mockResolvedValue({ owner: { organisation: undefined } } as any);
    jest.mocked(pdfParser.getSections).mockResolvedValue([]);
    jest.mocked(pdfParser.getSchema).mockResolvedValue({} as any);
    jest.mocked(pdfParser.getProgressInfo).mockResolvedValue({ deploymentCount: 1 });
  });

  it('skips the restricted progress API for innovator exports using the role type', async () => {
    await generateCSV('innovation-id', {
      headers: { 'x-is-role': 'innovator-role-id', 'x-is-role-type': UserRoleEnum.INNOVATOR }
    });

    expect(pdfParser.getProgressInfo).not.toHaveBeenCalled();
  });

  it('loads progress data for non-innovator exports', async () => {
    await generateCSV('innovation-id', {
      headers: { 'x-is-role': 'accessor-role-id', 'x-is-role-type': UserRoleEnum.ACCESSOR }
    });

    expect(pdfParser.getProgressInfo).toHaveBeenCalledTimes(1);
  });
});
