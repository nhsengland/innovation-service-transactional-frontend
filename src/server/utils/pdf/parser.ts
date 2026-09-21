import axios from 'axios';

import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import {
  AllSectionsOutboundPayloadType,
  getAllSectionsSummaryV3
} from '@modules/stores/innovation/innovation-record/ir-versions.config';
import { sectionType } from '@modules/stores/ctx/innovation/innovation.models';

import { ENVIRONMENT } from '../../config/constants.config';

import {
  DocumentGeneratorInnovationInfoError,
  PDFGeneratorParserError,
  PDFGeneratorSchemaGetError,
  PDFGeneratorSectionsNotFoundError
} from '../errors';
import { InnovationInfoDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationRecordSchemaInfoType } from '@modules/stores/ctx/schema/schema.types';
import { keyProgressAreas } from '@modules/stores/innovation/config/innovation-catalog.config';

export const getSchema = async (config: any): Promise<InnovationRecordSchemaInfoType> => {
  const url = `${ENVIRONMENT.API_INNOVATIONS_URL}/v1/ir-schema/`;
  const response = await axios.get<InnovationRecordSchemaInfoType>(url, { ...config });
  return response.data;
};

export const getSections = async (
  innovationId: string,
  config: any,
  version?: string
): Promise<{ section: sectionType; data: MappedObjectType }[]> => {
  const url = `${ENVIRONMENT.API_INNOVATIONS_URL}/v1/${innovationId}/all-sections`;
  const response = await axios.get<{ section: sectionType; data: MappedObjectType }[]>(url, {
    ...config,
    ...(version && { params: { version } })
  });
  return response.data;
};

export const getInnovationInfo = async (innovationId: string, config: any): Promise<InnovationInfoDTO> => {
  const url = `${ENVIRONMENT.API_INNOVATIONS_URL}/v1/${innovationId}`;
  const response = await axios.get<InnovationInfoDTO>(url, {
    ...config
  });
  return response.data;
};

export const getProgressInfo = async (innovationId: string, config: any): Promise<any> => {
  const url = `${ENVIRONMENT.API_INNOVATIONS_URL}/v1/${innovationId}/progress`;
  const response = await axios.get<any>(url, {
    ...config
  });
  return response.data;
};

export const generatePDFHandler = async (innovationId: string, body: any, config: any) => {
  const url = `${ENVIRONMENT.API_INNOVATIONS_URL}/v1/${innovationId}/pdf`;
  config.responseType = 'arraybuffer';
  config.responseEncoding = 'binary';
  config.headers['Content-Type'] = 'application/pdf';
  const response = await axios.post(url, body, config);
  return response.data;
};

export type InnovationRecordDocumentExportDataType = {
  sections: AllSectionsOutboundPayloadType;
  startSectionIndex: number;
};

export const getIRDocumentExportData = (
  documentType: 'CSV' | 'PDF',
  allSectionsData: AllSectionsOutboundPayloadType,
  companyInfo?: { name: string; size: null | string; registrationNumber: null | string },
  progressInfo?: any
): InnovationRecordDocumentExportDataType => {
  const sectionDataWithCompany: InnovationRecordDocumentExportDataType = {
    sections: allSectionsData,
    startSectionIndex: companyInfo ? 0 : 1
  };

  if ((documentType === 'PDF' && companyInfo) || documentType === 'CSV') {
    const sections: AllSectionsOutboundPayloadType = [
      {
        title: 'Company Details',
        sections: [
          {
            section: 'Company details',
            status: 'UNKNOWN',
            answers: [
              {
                label: 'What is the name of your company?',
                value: companyInfo?.name ?? ''
              },
              {
                label: 'Do you have a UK company registration number?',
                value: companyInfo?.registrationNumber ?? ''
              },
              {
                label: 'What is the size of your company or organisation?',
                value: companyInfo?.size ?? ''
              }
            ]
          }
        ]
      }
    ];

    if (progressInfo) {
      sections.push({
        title: 'Key progress areas',
        sections: [
          {
            section: 'Key progress areas',
            status: 'UNKNOWN',
            answers: keyProgressAreas.map(item => ({
              label: item.label,
              value: progressInfo[item.value] ? 'Yes' : 'No'
            }))
          }
        ]
      });
    }

    sectionDataWithCompany.sections = [...sections, ...allSectionsData];
  }

  return sectionDataWithCompany;
};

export const generatePDF = async (innovationId: string, config: any, version?: string) => {
  let schema: InnovationRecordSchemaInfoType;
  let content: AllSectionsOutboundPayloadType;
  let sections: { section: sectionType; data: MappedObjectType }[];

  let innovationInfo: InnovationInfoDTO;

  try {
    innovationInfo = await getInnovationInfo(innovationId, config);
  } catch (error: any) {
    throw new DocumentGeneratorInnovationInfoError(error);
  }

  try {
    sections = await getSections(innovationId, config, version);
  } catch (error: any) {
    throw new PDFGeneratorSectionsNotFoundError(error);
  }

  try {
    schema = await getSchema(config);
  } catch (error: any) {
    throw new PDFGeneratorSchemaGetError(error);
  }

  try {
    content = getAllSectionsSummaryV3(sections, schema);
  } catch (error: any) {
    throw new PDFGeneratorParserError(error);
  }

  const response = await generatePDFHandler(
    innovationId,
    getIRDocumentExportData('PDF', content, innovationInfo.owner?.organisation),
    config
  );

  return response;
};
