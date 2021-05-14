export type FormEngineFileUploadEvent = {
  type: 'fileAdded' | 'fileRemoved',
  data: {
    id: string;
    name: string;
  }
};

export type FormEngineFilesListEvent = {
  id: string;
  name: string;
};
