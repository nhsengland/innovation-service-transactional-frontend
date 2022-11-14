import axios from 'axios';

import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import { getInnovationInfoEndpointDTO, sectionType } from '@modules/stores/innovation/innovation.models';
import { AllSectionsOutboundPayloadType, getAllSectionsSummary } from '@modules/stores/innovation/innovation.config';

import { ENVIRONMENT } from '../../config/constants.config';

import { PDFGeneratorParserError, PDFGeneratorSectionsNotFoundError } from '../errors';


export const getSections = async (innovationId: string, config: any): Promise<{ section: sectionType, data: MappedObjectType }[]> => {
  const url = `${ENVIRONMENT.LOCAL_API_INNOVATIONS_BASE_URL}/api/v1/${innovationId}/all-sections`;
  const response = await axios.get<{
    section: sectionType;
    data: MappedObjectType
  }[]>(url, config);
  return response.data;
};

export const getInnovation = async (innovationId: string, config: any) => {
  const url = `${ENVIRONMENT.LOCAL_API_INNOVATIONS_BASE_URL}/api/v1/${innovationId}`;
  const response = await axios.get<getInnovationInfoEndpointDTO>(url, config);
  return response.data;
};

export const generatePDFHandler = async (innovationId: string, body: any, config: any) => {
  const url = `${ENVIRONMENT.LOCAL_API_INNOVATIONS_BASE_URL}/api/v1/${innovationId}/pdf`;
  config.responseType = 'arraybuffer';
  config.responseEncoding = 'binary';
  config.headers['Content-Type'] = 'application/pdf';
  const response = await axios.post(url, body, config);
  return response.data;
}

export const generatePDF = async (innovationId: string, config: any) => {

  let content: AllSectionsOutboundPayloadType;
  let sections: { section: sectionType, data: MappedObjectType }[];

  try {
    sections = await getSections(innovationId, config);
  } catch (error: any) {
    throw new PDFGeneratorSectionsNotFoundError(error);
  }

  try {
    content = getAllSectionsSummary(sections);
  } catch (error: any) {
    throw new PDFGeneratorParserError(error);
  }
  
  const response = await generatePDFHandler(innovationId, content, config);


  return response;

};
