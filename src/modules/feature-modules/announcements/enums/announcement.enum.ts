export const AnnouncementTemplateType = ['GENERIC'] as const;
export type AnnouncementTemplateType = typeof AnnouncementTemplateType[number];

export type AnnouncementParamsType = {
  GENERIC: {
    title: string,
    inset?: { title: string, description?: string, link?: { label: string, url: string } },
    description: string[],
    secondaryAction?: { label: string, url: string }
  }
}
