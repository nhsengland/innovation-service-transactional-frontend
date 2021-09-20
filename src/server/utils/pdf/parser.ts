import { PDFGenerator } from './PDFGenerator';
import axios from 'axios';
import { API_URL } from '../../config/constants.config';
import { getInnovationInfoEndpointDTO, sectionType } from '@modules/stores/innovation/innovation.models';
import { MappedObject } from '@modules/core';
import { AllSectionsOutboundPayloadType, AllSectionsSummary } from '@modules/stores/innovation/innovation.config';
import { PDFGeneratorInnovationNotFoundError, PDFGeneratorParserError, PDFGeneratorSectionsNotFoundError } from '../errors';

export const getSections = async (innovationId: string, userId: string, config: any): Promise<{section: sectionType, data: MappedObject}[]> => {
  const url = `${API_URL}/api/innovators/${userId}/innovations/${innovationId}/sections`;
  const response = await axios.get<{
    section: sectionType;
    data: MappedObject
  }[]>(url, config);
  return response.data;
};

export const getInnovation = async (userId: string, innovationId: string, config: any) => {
  const url = `${API_URL}/api/innovators/${userId}/innovations/${innovationId}`;
  const response = await axios.get<getInnovationInfoEndpointDTO>(url, config);
  return response.data;
};

export const generatePDF = async (innovationId: string, userId: string, config: any) => {

  let content: AllSectionsOutboundPayloadType;
  let innovation: getInnovationInfoEndpointDTO;
  let sections: {section: sectionType, data: MappedObject }[];

  const generator = new PDFGenerator();

  try {
    innovation = await getInnovation(userId, innovationId, config);
  }
  catch (error) {
    throw new PDFGeneratorInnovationNotFoundError(error);
  }

  try {
    sections = await getSections(innovationId, userId, config);
  } catch (error) {
    throw new PDFGeneratorSectionsNotFoundError(error);
  }

  try {
    content = AllSectionsSummary(sections);
  } catch (error) {
    throw new PDFGeneratorParserError(error);
  }

  // temporarely disables logo

  // generator
  //   .addLogo();

  generator
    .hero(innovation.name)
    .addPage();

  let currentSection = 1;
  let currentSubSection = 1;
  for (const entry of content) {

    // every major section goes into it's own page
    if (generator.currentPage > 1) {
      generator.addPage();
    }


    const title = `${currentSection}. ${entry.title}`;

    generator
      .h1(title);
    for (const section of entry.sections) {

      const title = `${currentSection}.${currentSubSection} ${section.section}`;
      currentSubSection++;
      generator
        .h2(title);

      for (const answer of section.answers) {
        const title = answer.label;
        generator
          .h3(title);

        const value = answer.value.replace(/\n/gi, ', ');
        generator
          .p(value);
      }
    }

    currentSection++;
    currentSubSection = 1;
  }

  const result = generator.save();
  return result;
};

export const splitTextBlock = (source: string[], position: number, documentSetup: DocumentSetup, parts: string[][]): string[][] => {

  // Get the real document size
  // if the current position is not the beginning of the page
  // the actual document size is the document height minus the current position of the caret
  const currentDocumentSize = Math.floor(documentSetup.documentHeight - position);

  // Calculate the height of the current block of text
  // Each entry in the source array corresponds to one line of text
  // So the height of the source array is the product of its length with the height of one line
  const blockSize = source.length * documentSetup.lineHeight;

  // The source will need to be split if its height overflows the document's real height
  if (blockSize > currentDocumentSize) {

    // Calculates how many lines of text will fit on the currently available document space
    // That will be the actual document height divided by the height of one line
    const lineAmount = Math.floor(currentDocumentSize / documentSetup.lineHeight);

    // Get a slice of the source array with just the amount of lines we know will fit on the current page
    // So we know each entry of the array is one line of text
    // Then we want a slice with the length equals to the amount of lines that will fit on the current page.
    const part = source.slice(0, lineAmount - 1);

    // add the part to the list of parts
    parts.push(part);

    // make a recursive call with the remainder of the source array
    // and with position 0, because now we know we're on a new page.
    splitTextBlock(source.slice(lineAmount - 1), 0, documentSetup, parts);
  } else {

    // if the source array fits on current page
    // add the array to the list of parts
    parts.push(source);
  }

  // return a list of arrays
  return parts;
};

export type DocumentSetup = {
  documentHeight: number,
  lineHeight: number,
};
