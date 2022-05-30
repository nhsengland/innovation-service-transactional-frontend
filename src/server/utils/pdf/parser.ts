import axios from 'axios';

import { MappedObject } from '@modules/core';
import { getInnovationInfoEndpointDTO, sectionType } from '@modules/stores/innovation/innovation.models';
import { AllSectionsOutboundPayloadType, getAllSectionsSummary } from '@modules/stores/innovation/innovation.config';

import { ENVIRONMENT } from '../../config/constants.config';
import { PDFGenerator } from './PDFGenerator';
import { PDFGeneratorInnovationNotFoundError, PDFGeneratorParserError, PDFGeneratorSectionsNotFoundError } from '../errors';


export const getSections = async (innovationId: string, userId: string, config: any): Promise<{ section: sectionType, data: MappedObject }[]> => {
  const url = `${ENVIRONMENT.API_URL}/api/innovators/${userId}/innovations/${innovationId}/sections`;
  const response = await axios.get<{
    section: sectionType;
    data: MappedObject
  }[]>(url, config);
  return response.data;
};

export const getInnovation = async (userId: string, innovationId: string, config: any) => {
  const url = `${ENVIRONMENT.API_URL}/api/innovators/${userId}/innovations/${innovationId}`;
  const response = await axios.get<getInnovationInfoEndpointDTO>(url, config);
  return response.data;
};

export const generatePDF = async (innovationId: string, userId: string, config: any) => {

  let content: AllSectionsOutboundPayloadType;
  let innovation: getInnovationInfoEndpointDTO;
  let sections: { section: sectionType, data: MappedObject }[];

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
    content = getAllSectionsSummary(sections);
  } catch (error) {
    throw new PDFGeneratorParserError(error);
  }
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


    generator.h1(`${currentSection}. ${entry.title}`);

    for (const section of entry.sections) {

      generator.h2(`${currentSection}.${currentSubSection} ${section.section}`);
      currentSubSection++;

      for (const answer of section.answers) {

        generator.h3(answer.label);
        generator.p(answer.value.replace(/\n/gi, ', '));

      }
    }

    currentSection++;
    currentSubSection = 1;
  }

  const result = generator.save();
  return result;

};
