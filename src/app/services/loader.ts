import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private _visible = new BehaviorSubject<boolean>(true);
  visible$ = this._visible.asObservable();

  show() { this._visible.next(true); }
  hide() { this._visible.next(false); }
}
