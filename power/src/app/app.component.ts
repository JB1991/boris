import {AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';

import {Subject, Subscription} from 'rxjs';

import {AppNameService} from '@app/app-name.service';

@Component({
  selector: 'power-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewChecked, OnDestroy {
  title = 'power';

  private unsubscribe$: Subject<void> = new Subject<void>();

  isCollapsed = true;

  show = false;

  name: string;
  appNameSubscription: Subscription;

  /**
   * Constructor
   * @param appNameService
   * @param cdRef
   */
  constructor(
    private cdRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  toggleCollapse() {
    this.show = !this.show;
  }
}
