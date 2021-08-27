import { PDFGenerator } from './PDFGenerator';
import axios from 'axios';
import { API_URL } from '../../config/constants.config';
import { getInnovationInfoEndpointDTO, sectionType } from '@modules/stores/innovation/innovation.models';
import { MappedObject } from '@modules/core';
import { AllSectionsSummary } from '@modules/stores/innovation/innovation.config';

const getSections = async (innovationId: string, userId: string, config: any): Promise<{section: sectionType, data: MappedObject}[]> => {
  const url = `${API_URL}/api/innovators/${userId}/innovations/${innovationId}/sections`;
  const response = await axios.get<{
    section: sectionType;
    data: MappedObject
  }[]>(url, config);
  return response.data;
};

const getInnovation = async (userId: string, innovationId: string, config: any) => {
  const url = `${API_URL}/api/innovators/${userId}/innovations/${innovationId}`;
  const response = await axios.get<getInnovationInfoEndpointDTO>(url, config);
  return response.data;
};

export const generatePDF = async (innovationId: string, userId: string, config: any) => {

  const innovation = await getInnovation(userId, innovationId, config);

  const generator = new PDFGenerator();

  const sections = await getSections(innovationId, userId, config);

  const content = AllSectionsSummary(sections);

  generator
    .addLogo();

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

        const value = answer.value.replace(/<br \/>/, ', ');
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
