import { computed, Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { ContextLayoutType, EMPTY_PAGE_CONTEXT } from './layout.types';
import { isPlatformServer } from '@angular/common';
import { DeepPartial } from '@app/base/types';
import { isUndefined, omitBy } from 'lodash';

@Injectable()
export class LayoutContextStore {
  // State
  private state = signal<ContextLayoutType>({ ...EMPTY_PAGE_CONTEXT, previousUrl: null, currentUrl: null });

  // Selectors
  status = computed(() => this.state().status);
  title = computed(() => this.state().title);
  pageTitle = computed(() => this.title()?.main ?? '');
  alert = computed(() => this.state().alert);
  backLink = computed(() => this.state().backLink);
  previousUrl = computed(() => this.state().previousUrl);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  update(info: DeepPartial<ContextLayoutType>): void {
    const dataToUpdate = omitBy<DeepPartial<ContextLayoutType>>(info, isUndefined);
    if (isPlatformServer(this.platformId) && 'status' in dataToUpdate) {
      dataToUpdate.status = 'LOADING';
    }
    this.state.update(state => ({ ...state, ...dataToUpdate }));
  }

  resetPage() {
    const empty = { ...EMPTY_PAGE_CONTEXT };

    // If is to be persisted on redirect we don't want to clear the alert until the next resetPage.
    const alert = this.alert();
    if (alert && alert.persistOneRedirect) {
      empty.alert = { ...alert, persistOneRedirect: false };
    }

    this.state.update(state => ({ ...state, ...empty }));
  }

  /**
   * sets the current url and the previous url if it is different from the current url
   */
  setCurrentUrl(url: string): void {
    if (this.state().currentUrl !== url) {
      this.state.update(state => ({ ...state, previousUrl: this.state().currentUrl, currentUrl: url }));
    }
  }
}
