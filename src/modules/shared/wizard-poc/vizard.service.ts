import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { VizardStep } from './vizard.types';

@Injectable()
export class VizardService<T> {
  private previousSubject = new Subject<T | undefined>();
  private nextSubject = new Subject<T | undefined>();
  private goToStepSubject = new Subject<string>();
  private submitSubject = new Subject<void>();

  private addStepSubject = new Subject<{ newStep: VizardStep; stepNumber?: number }>();
  private removeStepSubject = new Subject<string>();

  get previousSubject$(): Observable<Partial<T> | undefined> {
    return this.previousSubject.asObservable();
  }

  triggerPrevious(outputData?: T): void {
    this.previousSubject.next(outputData);
  }

  get nextSubject$(): Observable<T | undefined> {
    return this.nextSubject.asObservable();
  }

  triggerNext(outputData?: T): void {
    this.nextSubject.next(outputData);
  }

  get goToStepSubject$(): Observable<string> {
    return this.goToStepSubject.asObservable();
  }

  triggerGoToStep(stepId: string): void {
    this.goToStepSubject.next(stepId);
  }

  get submitSubject$(): Observable<void> {
    return this.submitSubject.asObservable();
  }

  triggerSubmit(): void {
    this.submitSubject.next();
  }

  get addStepSubject$(): Observable<{ newStep: VizardStep; stepNumber?: number }> {
    return this.addStepSubject.asObservable();
  }

  triggerAddStep(newStep: VizardStep, stepNumber?: number): void {
    this.addStepSubject.next({ newStep, stepNumber });
  }

  get removeStepSubject$(): Observable<string> {
    return this.removeStepSubject.asObservable();
  }

  triggerRemoveStep(stepId: string): void {
    this.removeStepSubject.next(stepId);
  }
}
