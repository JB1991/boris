import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingscreenService {
  public isVisible = false;

  constructor() { }

  /**
   * Shows or hides loadingscreen
   * @param state new state
   */
  public setVisible(state: boolean) {
    this.isVisible = state;
  }
}
