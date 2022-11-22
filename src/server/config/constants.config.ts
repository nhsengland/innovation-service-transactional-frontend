import * as dotenv from 'dotenv';

dotenv.config();


export const ENVIRONMENT = {

  BASE_URL: process.env.BASE_URL || '',
  BASE_PATH: ['', '/'].includes(process.env.BASE_PATH || '') ? '' : `${process.env.BASE_PATH?.startsWith('/') ? '' : '/'}${process.env.BASE_PATH}`,

  API_URL: process.env.API_URL || '',

  LOG_LEVEL: process.env.LOG_LEVEL || 'ERROR',
  VIEWS_PATH: process.env.VIEWS_PATH || '',
  STATIC_CONTENT_PATH: process.env.STATIC_CONTENT_PATH || '',
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS || true,

  LOCAL_MODE: process.env.LOCAL_MODE === 'true' ? true : false,

  LOCAL_API_ADMIN_ACTIVE: process.env.LOCAL_API_ADMIN_ACTIVE === 'true' ? true : false,
  LOCAL_API_INNOVATIONS_ACTIVE: process.env.LOCAL_API_INNOVATIONS_ACTIVE === 'true' ? true : false,
  LOCAL_API_USERS_ACTIVE: process.env.LOCAL_API_USERS_ACTIVE === 'true' ? true : false,

  LOCAL_API_USERS_BASE_URL: process.env.LOCAL_API_USERS_BASE_URL || '',
  LOCAL_API_INNOVATIONS_BASE_URL: process.env.LOCAL_API_INNOVATIONS_BASE_URL || '',
  LOCAL_API_ADMIN_BASE_URL: process.env.LOCAL_API_ADMIN_BASE_URL || ''

};
