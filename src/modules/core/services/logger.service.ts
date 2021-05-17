import { Injectable } from '@angular/core';
import axios from 'axios';
import { AxiosInstance } from 'axios';
import { ErrorHandler } from '@angular/core';
import { EnvironmentStore } from '../stores/environment.store';

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

@Injectable({
  providedIn: 'root',
})
export class LoggerService {

  private client: AxiosInstance;
  private errorHandler: ErrorHandler;
  private environment: EnvironmentStore;

  constructor(errorHandler: ErrorHandler, environmentStore: EnvironmentStore) {
    this.errorHandler = errorHandler;
    this.client = axios.create({
      timeout: 3000,
      headers: {
        'X-Initialized-At': Date.now().toString(),
      }
    });

    this.environment = environmentStore;
  }

  public async trackTrace(message: string, severity: Severity, props?: any ): Promise<LoggerResponse> {
    try {
      await this.client.request({
        method: 'POST',
        url: `${this.environment.BASE_URL}/insights`,
        data: {
          type: 'trace',
          message,
          severity,
          properties: {...props}
        }
      });

      return {
        success: true,
        type: 'trace'
      };

    } catch (error) {

      this.errorHandler.handleError( error );

      return {
        success: false,
        type: 'trace',
        error,
      };
    }
  }
}
