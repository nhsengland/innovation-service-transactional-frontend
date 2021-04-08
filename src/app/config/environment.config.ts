import { NgxLoggerLevel } from 'ngx-logger';

// TODO NHSAAC-134
// const env = window?['__env'] ? (window as { [key: string]: any })['__env'] : {};

const logLevel = 'TRACE';


export const environment = {
  API_URL: 'https://dev.innovation.nhs.uk', // env.API_URL,
  // API_URL: 'http://localhost:4200', // env.API_URL,
  LOG_LEVEL: NgxLoggerLevel[logLevel], // NgxLoggerLevel[(env.LOG_LEVEL as keyof typeof NgxLoggerLevel) || 'ERROR']
  BASE_URL: '/transactional',
};
