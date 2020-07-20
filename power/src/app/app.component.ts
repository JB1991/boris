import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Config, ConfigService } from '@app/config.service';
import { version } from '../../package.json';

@Component({
  selector: 'power-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewChecked, OnDestroy {
  title = 'power';
  isCollapsed = true;
  show = false;
  name: string;
  config: Config;
  appVersion: string = version;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    public cdRef: ChangeDetectorRef,
    public configService: ConfigService
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
