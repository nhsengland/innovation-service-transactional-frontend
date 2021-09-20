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
