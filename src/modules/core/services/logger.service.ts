/* istanbul ignore file */

import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

import { isPlatformBrowser } from '@angular/common';
import { EnvironmentVariablesStore } from '../stores/environment-variables.store';


export enum Severity {
  VERBOSE = 0,
  INFORMATION = 1,
  WARNING = 2,
  ERROR = 3,
  CRITICAL = 4
}

export type LoggerResponse = {
  success: boolean,
  type: string,
  error?: any,
};

@Injectable()
export class LoggerService {

  private client: AxiosInstance;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private envVariablesStore: EnvironmentVariablesStore
  ) {

    this.client = axios.create({
      timeout: 3000,
      headers: { 'X-Initialized-At': Date.now().toString() }
    });

  }

  async trackTrace(message: string, severity: Severity, props?: any): Promise<LoggerResponse> {

    try {

      if (isPlatformBrowser(this.platformId)) {
        await this.client.request({
          method: 'POST',
          url: `${this.envVariablesStore.APP_URL}/insights`,
          data: {
            type: 'trace',
            message,
            severity,
            properties: { ...props }
          }
        });
      } else {
        console.error(`[TRACE] [${severity}] ${message}`, props);
      }
      return { success: true, type: 'trace' };
    } catch (error) {
      console.error(`[TRACE ERROR] [${severity}] ${message}`, props, error);
      return { success: false, type: 'trace', error };

    }

  }

}
