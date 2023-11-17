import axios from 'axios';

import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import { AllSectionsOutboundPayloadType, getAllSectionsSummary } from '@modules/stores/innovation/innovation-record/ir-versions.config';
import { sectionType } from '@modules/stores/innovation/innovation.models';

import { ENVIRONMENT } from '../../config/constants.config';

import { CSVGeneratorParserError, CSVGeneratorSectionsNotFoundError, PDFGeneratorParserError, PDFGeneratorSectionsNotFoundError } from '../errors';
import { getSections } from '../pdf/parser';
import { add } from 'lodash';

export const generateCSVHandler = async (innovationId: string, body: any, config: any) => {
  const url = `${ENVIRONMENT.API_INNOVATIONS_URL}/v1/${innovationId}/csv`;
  config.responseType = 'arraybuffer';
  config.responseEncoding = 'binary';
  config.headers['Content-Type'] = 'text/csv';
  const response = await axios.post(url, body, config);
  return response.data;
}

export const generateCSV = async (innovationId: string, config: any, version?: string) => {

  let content: AllSectionsOutboundPayloadType;
  let sections: { section: sectionType, data: MappedObjectType }[];
  let parsedCSV: string;

  try {
    sections = await getSections(innovationId, config, version);
  } catch (error: any) {
    throw new CSVGeneratorSectionsNotFoundError(error);
  }

  try {
    content = getAllSectionsSummary(sections, version);
    // parsedCSV = parseCsvText(content);
  } catch (error: any) {
    throw new CSVGeneratorParserError(error);
  }

  const response = await generateCSVHandler(innovationId, content, config);

  return response;

};
