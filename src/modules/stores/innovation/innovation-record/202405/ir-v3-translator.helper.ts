import { MappedObjectType } from '../../../../core/interfaces/base.interfaces';
import { Parser } from 'expr-eval';
import { dummy_schema_V3_202405 } from './ir-v3-schema';
import { InnovationRecordSectionAnswersType } from './ir-v3-types';

const mapText = (
  answer: string,
  schemaQuestion: MappedObjectType,
  schemaAnswers: MappedObjectType,
  data: MappedObjectType
) => {
  schemaAnswers[schemaQuestion.id] = answer;
  data[schemaQuestion.id] = answer;
};

const mapRadioGroup = (
  answer: string,
  subSection: MappedObjectType,
  schemaQuestion: MappedObjectType,
  schemaSubSection: MappedObjectType,
  schemaAnswers: MappedObjectType,
  data: MappedObjectType
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
    data[schemaQuestion.id] = item.id;
  } else {
    schemaAnswers[schemaQuestion.id] = itemId;
    data[schemaQuestion.id] = itemId;
  }
};

const mapArray = (
  answer: string[],
  subSection: MappedObjectType,
  schemaQuestion: MappedObjectType,
  schemaAnswers: MappedObjectType,
  data: MappedObjectType
) => {
  if (!answer.length) return;

  schemaAnswers[schemaQuestion.id] = [];
  data[schemaQuestion.id] = [];

  answer.forEach((value: string) => {
    const itemId = IRV3Helper.camelize(value);
    const item = schemaQuestion.items.find((item: any) => item.id === itemId);

    if (item) {
      if (item.conditional) {
        if (subSection[item.conditional.id]) {
          schemaAnswers[schemaQuestion.id].push(item.id);
          schemaAnswers[item.conditional.id] = subSection[item.conditional.id];
        }
        data[schemaQuestion.id].push(item.id);
      } else {
        schemaAnswers[schemaQuestion.id].push(item.id);
        data[schemaQuestion.id].push(item.id);
      }
    } else {
      schemaAnswers[schemaQuestion.id].push(itemId);
      data[schemaQuestion.id].push(itemId);
    }
  });
};

const mapFieldsGroup = (
  answer: MappedObjectType,
  schemaQuestion: MappedObjectType,
  schemaAnswers: MappedObjectType,
  data: MappedObjectType
) => {
  if (!answer.lenght) return;

  schemaAnswers[schemaQuestion.id] = [];

  answer.forEach((item: any) => {
    let newItem;

    if (item[schemaQuestion.field.id]) {
      newItem = item[schemaQuestion.field.id];
    } else return;

    if (schemaQuestion.addQuestion) {
      if (item[schemaQuestion.addQuestion.id]) {
        newItem = {
          [schemaQuestion.field.id]: item[schemaQuestion.field.id],
          [schemaQuestion.addQuestion.id]: item[schemaQuestion.addQuestion.id]
        };
      }
    }

    schemaAnswers.push(newItem);
    data.push(newItem);
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
      return v2Answers.standards?.map((item: any) => item.type);
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

  static translateIR(innovationRecord: MappedObjectType): InnovationRecordSectionAnswersType {
    const v3Answers: MappedObjectType = {};
    const data: MappedObjectType = {};

    const v2Answers = Object.keys(innovationRecord.document).reduce((acc, key) => {
      if (['version', 'evidences'].includes(key)) return acc;

      return Object.keys(innovationRecord.document[key]).reduce((acc, id) => {
        if (id === 'files') return acc;
        if (!innovationRecord.document[key][id]) return acc;

        if (acc[id]) {
          console.log(JSON.stringify(innovationRecord, null, 2));
          throw new Error(`Repeated answers (${innovationRecord.id}): ${id}`);
        }

        acc[id] = innovationRecord.document[key][id];

        return acc;
      }, acc);
    }, {} as MappedObjectType);

    dummy_schema_V3_202405.sections.forEach(section => {
      section.subSections.forEach(subSection => {
        subSection.questions.forEach(question => {
          if (
            'condition' in question &&
            typeof question.condition === 'string' &&
            !Parser.evaluate(question.condition, { data })
          ) {
            return;
          }

          const answer = searchAnswer(v2Answers, question);

          if (!answer) return;

          if (question.dataType === 'text') {
            mapText(answer, question, v3Answers, data);
          } else if (question.dataType === 'textarea') {
            mapText(answer, question, v3Answers, data);
          } else if (question.dataType === 'radio-group') {
            mapRadioGroup(answer, v2Answers, question, subSection, v3Answers, data);
          } else if (question.dataType === 'autocomplete-array') {
            mapArray(answer, v2Answers, question, v3Answers, data);
          } else if (question.dataType === 'checkbox-array') {
            mapArray(answer, v2Answers, question, v3Answers, data);
          } else if (question.dataType === 'fields-group') {
            mapFieldsGroup(answer, question, v3Answers, data);
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
}