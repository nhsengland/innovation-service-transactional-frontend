import { Observable, BehaviorSubject } from 'rxjs';

export class Store<T> {
  private storeId: string;
  private stateBS: BehaviorSubject<T>; // Using a behavior subject so we can provide a default value.
  private stateO$: Observable<T>;

  get state(): T {
    return this.stateBS.getValue();
  }
  get state$(): Observable<T> {
    return this.stateO$;
  }

  constructor(storeId: string, initialState: T) {
    this.storeId = storeId;
    this.stateBS = new BehaviorSubject(initialState);
    this.stateO$ = this.stateBS.asObservable();
  }

  getStoreId(): string {
    return this.storeId;
  }
  setStoreId(s: string): void {
    this.storeId = s;
  }

  setState(nextState?: T): void {
    this.stateBS.next(nextState ?? this.state);
  }

  // getStorageState(storeId: string): T {
  //   const ls = localStorage.getItem(storeId);
  //   return ls ? JSON.parse(ls) : null;
  // }

  // setStateAndSave(nextState: T): void {
  //   this.stateBS.next(nextState);
  //   // localStorage.setItem(this.storeId, JSON.stringify(this.state));
  // }
}
