import axios from 'axios';

import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import {
  AllSectionsOutboundPayloadType,
  getAllSectionsSummary
} from '@modules/stores/innovation/innovation-record/ir-versions.config';
import { sectionType } from '@modules/stores/innovation/innovation.models';

import { ENVIRONMENT } from '../../config/constants.config';

import { PDFGeneratorParserError, PDFGeneratorSectionsNotFoundError } from '../errors';

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

export const generatePDFHandler = async (innovationId: string, body: any, config: any) => {
  const url = `${ENVIRONMENT.API_INNOVATIONS_URL}/v1/${innovationId}/pdf`;
  config.responseType = 'arraybuffer';
  config.responseEncoding = 'binary';
  config.headers['Content-Type'] = 'application/pdf';
  const response = await axios.post(url, body, config);
  return response.data;
};

export const generatePDF = async (innovationId: string, config: any, version?: string) => {
  let content: AllSectionsOutboundPayloadType;
  let sections: { section: sectionType; data: MappedObjectType }[];

  try {
    sections = await getSections(innovationId, config, version);
  } catch (error: any) {
    throw new PDFGeneratorSectionsNotFoundError(error);
  }

  try {
    content = getAllSectionsSummary(sections, version);
  } catch (error: any) {
    throw new PDFGeneratorParserError(error);
  }

  const response = await generatePDFHandler(innovationId, content, config);

  return response;
};
