import { PDFGenerator } from './PDFGenerator';
import axios from 'axios';
import { API_URL } from '../../config/constants.config';
import { sectionType } from '@modules/stores/innovation/innovation.models';
import { MappedObject } from '@modules/core';
import { AllSectionsSummary } from '@modules/stores/innovation/innovation.config';

const getSections = async (innovationId: string, userId: string, config: any): Promise<{section: sectionType, data: MappedObject}[]> => {
  const url = `${API_URL}/api/innovators/${userId}/innovations/${innovationId}/sections`;

  console.log(url);

  const response = await axios.get<{
    section: sectionType;
    data: MappedObject
  }[]>(url, config);

  console.log(response.data);
  return response.data;
};

export const generatePDF = async (innovationId: string, userId: string, config: any) => {

  const generator = new PDFGenerator();

  const sections = await getSections(innovationId, userId, config);

  const content = AllSectionsSummary(sections);
  console.log('CONTENT', content);
  for (const entry of content) {

    const title = entry.title;

    generator
      .addBoldText(title, 30)
      .addVerticalSpace(20);

    for (const section of entry.sections) {

      const title = section.section;
      generator
        .addBoldText(title, 18)
        .addVerticalSpace(10);

      for (const answer of section.answers) {
console.log('ANSWER', answer);
const title = answer.label;
generator
          .addBoldText(title, 14)
          .addVerticalSpace(5);

const value = answer.value.replace('<br />', ', ');
console.log(answer.value);
generator
          .addText(value, 10)
          .addVerticalSpace(10);
      }
    }
  }

  const result = generator.save();
  return result;
};
