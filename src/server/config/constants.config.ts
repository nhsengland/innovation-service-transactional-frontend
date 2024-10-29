import * as dotenv from 'dotenv';

dotenv.config();

export const ENVIRONMENT = {
  BASE_URL: process.env.BASE_URL || '',
  BASE_PATH: ['', '/'].includes(process.env.BASE_PATH || '')
    ? ''
    : `${process.env.BASE_PATH?.startsWith('/') ? '' : '/'}${process.env.BASE_PATH}`,

  API_URL: process.env.API_URL || '',
  API_INNOVATIONS_URL: process.env.LOCAL_API_INNOVATIONS_BASE_URL
    ? `${process.env.LOCAL_API_INNOVATIONS_BASE_URL}/api`
    : `${process.env.API_URL}/api/innovations`,
  API_ADMINS_URL: process.env.LOCAL_API_ADMIN_BASE_URL
    ? `${process.env.LOCAL_API_ADMIN_BASE_URL}/api`
    : `${process.env.API_URL}/api/admins`,
  API_USERS_URL: process.env.LOCAL_API_USERS_BASE_URL
    ? `${process.env.LOCAL_API_USERS_BASE_URL}/api`
    : `${process.env.API_URL}/api/users`,

  LOG_LEVEL: process.env.LOG_LEVEL || 'ERROR',
  VIEWS_PATH: process.env.VIEWS_PATH || '',
  STATIC_CONTENT_PATH: process.env.STATIC_CONTENT_PATH || '',
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS || true,
  APPLICATIONINSIGHTS_CONNECTION_STRING: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || '',
  TAG_MEASUREMENT_ID: process.env.TAG_MEASUREMENT_ID || '',
  GTM_ID: process.env.GTM_ID || ''
};
