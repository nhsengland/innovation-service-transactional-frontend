import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, Output, EventEmitter, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { interval, Subscription } from 'rxjs';


@Component({
  selector: 'theme-activity-timeout',
  templateUrl: './activity-timeout.component.html',
  styleUrls: ['./activity-timeout.component.scss']
})
export class ActivityTimeoutComponent implements OnInit, OnDestroy {

  @Input() minutesToLogout = 60; // In minutes.
  @Input() secondsToWarningCounter = 60; // In seconds.
  @Output() timeoutEvent = new EventEmitter<null>();

  CHECK_INTERVAL = 15; // In seconds

  private timeoutSubscription: null | Subscription = null;
  private warningCounterSubscription: null | Subscription = null;

  lastActivityTimestamp: number;

  private firstElement: null | HTMLElement = null;
  private lastElement: null | HTMLElement = null;

  warningCounter: number;
  state: 'IDLE' | 'WARNING' | 'TIMED_OUT' = 'IDLE';


  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) {

    this.lastActivityTimestamp = Date.now();
    this.warningCounter = this.secondsToWarningCounter;

  }


  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {

      document.body.addEventListener('click', () => this.reset());
      document.body.addEventListener('mouseover', () => this.reset());
      document.body.addEventListener('keyup', () => this.reset());

      this.timeoutSubscription = interval(this.CHECK_INTERVAL * 1000).subscribe(() => this.check());

    }

    console.log('Timeout started', this.minutesToLogout);

  }



  check(): void {

    if (this.state === 'WARNING') { return; }

    const timeLeft = this.lastActivityTimestamp + this.minutesToLogout * 60 * 1000;
    const difference = timeLeft - Date.now();

    if (difference < 60000) { // Shows warning if 1 minute remaining.
      this.state = 'WARNING';
      this.warningCounter = this.secondsToWarningCounter;

      if (this.warningCounterSubscription) { this.warningCounterSubscription.unsubscribe(); }
      this.warningCounterSubscription = interval(1000).subscribe(() => this.decreaseWarningCounter());

      this.setAccessibility();

    }

  }



  reset(): void {

    if (this.state === 'WARNING') { return; }

    this.lastActivityTimestamp = Date.now();

  }

  keepSignedIn(): void {

    this.state = 'IDLE';
    this.reset();
    if (this.warningCounterSubscription) { this.warningCounterSubscription.unsubscribe(); }

  }


  decreaseWarningCounter(): void {
    if (--this.warningCounter === 0) { this.signOut(); }
  }

  signOut(): void {
    /* istanbul ignore next */
    this.timeoutEvent.emit();
  }


  setAccessibility(): void {

    if (isPlatformBrowser(this.platformId) && !this.firstElement) {
      setTimeout(() => { // Await for the html injection if needed.

        this.firstElement = document.getElementById('timeout-dialog');
        this.lastElement = document.getElementById('timeout-dialog-sign-out-link');

        this.firstElement?.focus();
        this.lastElement?.addEventListener('blur', () => { this.firstElement?.focus(); });

      });
    }

  }


  ngOnDestroy(): void {

    if (isPlatformBrowser(this.platformId)) {
      document.body.removeEventListener('click', () => this.reset());
      document.body.removeEventListener('mouseover', () => this.reset());
      document.body.removeEventListener('keyup', () => this.reset());
    }

    if (this.timeoutSubscription) { this.timeoutSubscription.unsubscribe(); }
    if (this.warningCounterSubscription) { this.warningCounterSubscription.unsubscribe(); }

  }

}
