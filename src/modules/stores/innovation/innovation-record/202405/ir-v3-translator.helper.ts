import { MappedObjectType } from '../../../../core/interfaces/base.interfaces';
import { dummy_schema_V3_202405 } from './ir-v3-schema';
import { InnovationSectionInfoDTO, sectionType } from '../../innovation.models';
import { subscribe } from 'diagnostics_channel';

const mapText = (answer: string, schemaQuestion: MappedObjectType, schemaAnswers: MappedObjectType) => {
  schemaAnswers[schemaQuestion.id] = answer;
};

const mapRadioGroup = (
  answer: string,
  subSection: MappedObjectType,
  schemaQuestion: MappedObjectType,
  schemaSubSection: MappedObjectType,
  schemaAnswers: MappedObjectType
) => {
  let item: any;
  let itemList;
  const itemId = IRV3Helper.camelize(answer);

  if (typeof schemaQuestion.items === 'string') {
    const relatedSchemaQuestion = schemaSubSection.questions.find(
      (question: any) => question.id === schemaQuestion.items
    );

    if (!relatedSchemaQuestion) return;

    itemList = relatedSchemaQuestion.items;
  } else {
    itemList = schemaQuestion.items;
  }

  item = itemList.find((item: any) => item.id === itemId);

  if (item) {
    if (item.conditional) {
      if (subSection[item.conditional.id]) {
        schemaAnswers[schemaQuestion.id] = item.id;
        schemaAnswers[item.conditional.id] = subSection[item.conditional.id];
      }
    } else {
      schemaAnswers[schemaQuestion.id] = item.id;
    }
  }
};

const mapArray = (
  answer: string[],
  subSection: MappedObjectType,
  schemaQuestion: MappedObjectType,
  schemaAnswers: MappedObjectType
) => {
  if (!answer.length) return;

  schemaAnswers[schemaQuestion.id] = [];

  answer.forEach((value: any) => {
    const itemId = IRV3Helper.camelize(value.id ? value.id : value);
    const item = schemaQuestion.items.find((item: any) => item.id === itemId);

    if (item) {
      if (schemaQuestion.addQuestion) {
        const item2 = schemaQuestion.addQuestion.items.find(
          (item: any) => item.id === IRV3Helper.camelize(value.addQuestion)
        );
        schemaAnswers[schemaQuestion.id].push({
          [schemaQuestion.id]: item.id,
          [schemaQuestion.addQuestion.id]: item2.id
        });
      } else {
        schemaAnswers[schemaQuestion.id].push(item.id);
      }
      if (item.conditional) {
        if (subSection[item.conditional.id]) {
          schemaAnswers[item.conditional.id] = subSection[item.conditional.id];
        }
      }
    }
  });
};

const mapFieldsGroup = (
  answer: MappedObjectType,
  schemaQuestion: MappedObjectType,
  schemaAnswers: MappedObjectType
) => {
  if (!answer.length) return;

  schemaAnswers[schemaQuestion.id] = [];

  answer.forEach((item: any, i: number) => {
    const itemObj: MappedObjectType = {};

    if (item[schemaQuestion.field.id]) {
      itemObj[schemaQuestion.field.id] = item[schemaQuestion.field.id];
    } else return;

    if (schemaQuestion.addQuestion) {
      itemObj[schemaQuestion.addQuestion.id] = item[schemaQuestion.addQuestion.id];
    }

    schemaAnswers[schemaQuestion.id].push(itemObj);
  });
};

const searchAnswer = (v2Answers: MappedObjectType, question: MappedObjectType) => {
  if (v2Answers[question.id]) return v2Answers[question.id];

  switch (question.id) {
    case 'officeLocation':
      return v2Answers.countryName && question.items.some((item: any) => item.label === v2Answers.countryName)
        ? v2Answers.countryName
        : 'Based Outside Uk';
    case 'countryLocation':
      return v2Answers.countryName && question.items.some((item: any) => item.label === v2Answers.countryName)
        ? [v2Answers.countryName]
        : null;
    case 'hasWebsite':
      return v2Answers.website ? 'YES' : 'NO';
    case 'standardsType':
      return v2Answers.standards?.map((item: any) => {
        return {
          id: item.type,
          addQuestion: item.hasMet
        };
      });
    case 'stepDeploymentPlans':
      return v2Answers.deploymentPlans?.map((item: any) => ({
        organizationDepartment: item
      }));
    default:
      return null;
  }
};

export class IRV3Helper {
  static camelize(str: string) {
    return str
      .trim()
      .toLowerCase()
      .replace(/(?<!\d)[^0-9a-z]+(?!\d)/g, ' ')
      .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match: string, index: number) => {
        if (+match === 0) return '';

        return index === 0 ? match.toLowerCase() : match.toUpperCase();
      });
  }

  static stepChildParent(sectionId: string): MappedObjectType {
    const stepsChildParentRelationsMap = new Map();

    dummy_schema_V3_202405.sections.forEach(section => {
      section.subSections.forEach(subSection => {
        const stepsChildParentRelations: MappedObjectType = {};

        subSection.questions.forEach(question => {
          if (question.condition) {
            stepsChildParentRelations[question.id] = question.condition.id;
          }

          if (question.items && question.items[0].itemsFromAnswer) {
            stepsChildParentRelations[question.id] = question.items[0].itemsFromAnswer;
          }

          if (question.addQuestion && !question.field) {
            stepsChildParentRelations[question.addQuestion.id] = question.id;
          }

          if (question.addQuestion && question.field) {
            stepsChildParentRelations[question.addQuestion.id] = question.id;
          }
        });

        if (Object.keys(stepsChildParentRelations).length) {
          subSection.stepsChildParentRelations = stepsChildParentRelations;
          stepsChildParentRelationsMap.set(subSection.id, stepsChildParentRelations);
        }
      });
    });
    return stepsChildParentRelationsMap.get(sectionId);
  }

  static translateSections(
    sections: { section: sectionType; data: MappedObjectType }[]
  ): { section: sectionType; data: MappedObjectType }[] {
    const translated = sections.map(s => {
      return {
        section: {
          ...s.section,
          section: IRV3Helper.camelize(s.section.section)
        },
        data: IRV3Helper.translateIRData(s.data)
      };
    });

    return translated;
  }

  static translateIRData(data: MappedObjectType): MappedObjectType {
    const v3Answers: MappedObjectType = {};

    dummy_schema_V3_202405.sections.forEach(section => {
      section.subSections.forEach(subSection => {
        subSection.questions.forEach(question => {
          if (question.condition && !question.condition?.options.includes(v3Answers[question.condition.id])) return;

          const answer = searchAnswer(data, question);
          if (!answer) return;
          if (question.dataType === 'text') {
            mapText(answer, question, v3Answers);
          } else if (question.dataType === 'textarea') {
            mapText(answer, question, v3Answers);
          } else if (question.dataType === 'radio-group') {
            mapRadioGroup(answer, data, question, subSection, v3Answers);
          } else if (question.dataType === 'autocomplete-array') {
            mapArray(answer, data, question, v3Answers);
          } else if (question.dataType === 'checkbox-array') {
            mapArray(answer, data, question, v3Answers);
          } else if (question.dataType === 'fields-group') {
            mapFieldsGroup(answer, question, v3Answers);
          } else {
            console.log(`==> NOT MAPPED ${question.id} (${question.dataType})`);
            console.log(JSON.stringify(subSection, null, 2));
            process.exit(1);
          }
        });
      });
    });

    return v3Answers;
  }

  static translateIR(innovationRecord: InnovationSectionInfoDTO): InnovationSectionInfoDTO {
    const v3Answers = IRV3Helper.translateIRData(innovationRecord.data);

    console.log('V2');
    console.log(innovationRecord.data);
    console.log('V3');
    console.log(v3Answers);

    return {
      id: innovationRecord.id,
      section: innovationRecord.section,
      status: innovationRecord.status,
      updatedAt: innovationRecord.updatedAt,
      submittedAt: innovationRecord.submittedAt,
      submittedBy: innovationRecord.submittedBy,
      tasksIds: innovationRecord.tasksIds,
      data: v3Answers
    };
  }
}
