import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoadingscreenService {
  public isVisible = false;

  constructor(private router: Router) {
    // hide loadingscreen after routing event
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isVisible = false;
      }
    });
  }

  /**
   * Shows or hides loadingscreen
   * @param state new state
   */
  public setVisible(state: boolean) {
    this.isVisible = state;
  }

  /**
   * Resets service to empty model
   */
  public resetService() {
    this.isVisible = false;
  }
}
