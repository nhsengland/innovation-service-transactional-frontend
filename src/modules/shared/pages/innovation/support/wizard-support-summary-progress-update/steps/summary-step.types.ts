import { AddDocumentStepOutputType } from './add-document-step.types';
import { DescriptionStepOutputType } from './description-step.types';
import { DocumentDescriptionStepOutputType } from './document-description-step.types';
import { DocumentFileStepOutputType } from './document-file-step.types';
import { DocumentNameStepOutputType } from './document-name-step.types';
import { TitleStepOutputType } from './title-step.types';

export type SummaryStepInputType = {
  titleStep: TitleStepOutputType;
  descriptionStep: DescriptionStepOutputType;
  addDocumentStep: AddDocumentStepOutputType;
  documentNameStep: DocumentNameStepOutputType;
  documentDescriptionStep: DocumentDescriptionStepOutputType;
  documentFileStep: DocumentFileStepOutputType;
  date: string;
};
