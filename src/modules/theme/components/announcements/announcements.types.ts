export type AnnouncementParamsType = {
  GENERIC: {
    title?: string;
    content?: string;
    link?: { label: string; url: string };
    relatedInnovations?: { id: string; name: string }[];
    inset?: { title?: string; content?: string; link?: { label: string; url: string } };
    actionLink?: { label: string; url: string };
  };
};
