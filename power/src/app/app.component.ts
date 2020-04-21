import {AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';

import {Subject, Subscription} from 'rxjs';
import {Config, ConfigService} from '@app/config.service';

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

  config: Config;
  /**
   * Constructor
   * @param cdRef
   * @param configService
   */
  constructor(
    private cdRef: ChangeDetectorRef,
    private configService: ConfigService
  ) {
  }

  ngOnInit(): void {
    this.config = this.configService.config;
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
