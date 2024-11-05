import axios from 'axios';

import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import {
  AllSectionsOutboundPayloadType,
  getAllSectionsSummaryV3
} from '@modules/stores/innovation/innovation-record/ir-versions.config';
import { sectionType } from '@modules/stores/ctx/innovation/innovation.models';

import { ENVIRONMENT } from '../../config/constants.config';

import {
  CSVGeneratorSectionsNotFoundError,
  DocumentGeneratorInnovationInfoError,
  PDFGeneratorParserError,
  PDFGeneratorSchemaGetError
} from '../errors';
import { getIRDocumentExportData, getInnovationInfo, getSchema, getSections } from '../pdf/parser';
import { InnovationInfoDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationRecordSchemaInfoType } from '@modules/stores/innovation/innovation-record/innovation-record-schema/innovation-record-schema.models';

export const generateCSVHandler = async (innovationId: string, body: any, config: any) => {
  const url = `${ENVIRONMENT.API_INNOVATIONS_URL}/v1/${innovationId}/csv`;
  config.responseType = 'arraybuffer';
  config.responseEncoding = 'binary';
  config.headers['Content-Type'] = 'text/csv';
  const response = await axios.post(url, body, config);
  return response.data;
};

export const generateCSV = async (innovationId: string, config: any, version?: string) => {
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
    throw new CSVGeneratorSectionsNotFoundError(error);
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

  const response = await generateCSVHandler(
    innovationId,
    getIRDocumentExportData('CSV', content, innovationInfo.owner?.organisation),
    config
  );

  return response;
};
