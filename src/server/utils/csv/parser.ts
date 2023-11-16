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
    parsedCSV = parseCsvText(content);
  } catch (error: any) {
    throw new CSVGeneratorParserError(error);
  }

  const response = await generateCSVHandler(innovationId, parsedCSV, config);

  return response;

};

export const parseCsvText = (content: AllSectionsOutboundPayloadType ): string => {

  let csvData: string = '';
  let sectionIndex = 0;
  let subsectionIndex = 0;
  let questionIndex = 0;

  // Add headers
  csvData = 'Section,Question,Answer,\n';

  content.map(section => {
    sectionIndex = content.indexOf(section) + 1;
    let sectionNumber = `${sectionIndex}.`;
    // Add section line
    csvData += (formatCsvLine(sectionNumber, section.title));

    section.sections.map(subsection => {

      subsectionIndex = section.sections.indexOf(subsection) + 1;
      let subsectionNumber = `${sectionIndex}.${subsectionIndex}.`;
      // Add subsection line
      csvData += (formatCsvLine(subsectionNumber, subsection.section));

      subsection.answers.map(question => {
        questionIndex = subsection.answers.indexOf(question) + 1;
        let questionNumber= `${sectionIndex}.${subsectionIndex}.${questionIndex}.`;
        // Add question line
        csvData +=(formatCsvLine(questionNumber, '', question.label, question.value));
      })
    })
  })

  console.log('CSV DATA: ');
  console.log(csvData);

  return csvData;

}

export const formatCsvLine = (section?: string, title?: string, question?: string, answer?: string): string => {
  let sectionNum = section? `${section} ` : '';
  let lineTitle = `${sectionNum}${title ?? ''}` ?? '';
  let lineQuestion = question? `"${question}"` : '';
  let lineAnswer = answer?  `"${answer}"` : '-';

  let csvLine: string = lineTitle + ',' + lineQuestion + ',' + lineAnswer + ',' + '\n'; 
  return csvLine 
}

