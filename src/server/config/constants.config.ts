import * as dotenv from 'dotenv';

dotenv.config();

export const BASE_URL = process.env.BASE_URL || '';
export const BASE_PATH = ['', '/'].includes(process.env.BASE_PATH || '') ? '' : `${process.env.BASE_PATH?.startsWith('/') ? '' : '/'}${process.env.BASE_PATH}`;
export const API_URL = process.env.API_URL || '';
export const LOG_LEVEL = process.env.LOG_LEVEL || 'ERROR';
export const VIEWS_PATH = process.env.VIEWS_PATH || '';
export const STATIC_CONTENT_PATH = process.env.STATIC_CONTENT_PATH || '';
export const ENABLE_ANALYTICS = process.env.ENABLE_ANALYTICS || true;
