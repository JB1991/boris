import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoadingscreenService {
  public visible = false;

  constructor(public router: Router) {
    // hide loadingscreen after routing event
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.visible = false;
      }
    });
  }

  /**
   * Shows or hides loadingscreen
   * @param state new state
   */
  public setVisible(state: boolean) {
    this.visible = state;
  }

  /**
   * Returns loadingscreen state
   */
  public isVisible(): boolean {
    return this.visible;
  }

  /**
   * Resets service to empty model
   */
  public resetService() {
    this.visible = false;
  }
}
