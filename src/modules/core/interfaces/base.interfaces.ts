export type MappedObjectType = Record<string, any>;

export type LinkType = {
  type: 'link' | 'button';
  label: string;
  url: string;
  fullReload?: boolean;
};

export type AlertType = {
  type: null | 'ACTION' | 'INFORMATION' | 'SUCCESS' | 'WARNING' | 'ERROR';
  title?: string;
  message?: string;
  setFocus?: boolean;
};

export type NotificationValueType = null | 'dot' | 'new' | number;

// Date's custom types.
/**
 * Represent a string like `2021-01-08`
 */
type DateISODateType = `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

/**
 * Represent a string like `14:42:34.678`
 */
type DateISOTimeType = `${number}${number}:${number}${number}:${number}${number}.${number}${number}${number}`;

/**
 * Represent a string like `2021-01-08T14:42:34.678Z` (format: ISO 8601).
 * Due to a bug on current version of TypeScript, it is not possible to have such a complex type.
 * Maybe in a future version... For now, string is enought...
 */
// export type DateISOType = `${DateISODateType}T${DateISOTimeType}Z`;
export type DateISOType = string;
