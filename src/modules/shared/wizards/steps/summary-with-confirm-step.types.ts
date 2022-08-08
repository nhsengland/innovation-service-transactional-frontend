export type SummaryWithConfirmStepInputType = {

  summary: { label: string, value: string }[];
  confirmCheckbox: { label: string };
  submitButton: { label: string, active: boolean };

};

export type SummaryWithConfirmStepOutputType = {

  confirm: boolean;

};
