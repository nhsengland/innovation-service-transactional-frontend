/* istanbul ignore file */

import { Injectable, ErrorHandler } from '@angular/core';
import { AxiosInstance } from 'axios';
import axios from 'axios';

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
    private errorHandler: ErrorHandler,
    private envVariablesStore: EnvironmentVariablesStore
  ) {

    this.client = axios.create({
      timeout: 3000,
      headers: { 'X-Initialized-At': Date.now().toString() }
    });

  }

  async trackTrace(message: string, severity: Severity, props?: any): Promise<LoggerResponse> {

    try {

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

      return { success: true, type: 'trace' };

    } catch (error) {

      this.errorHandler.handleError(error);

      return { success: false, type: 'trace', error };

    }

  }

}
