import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Config, ConfigService } from '@app/config.service';
import { HttpClient } from '@angular/common/http';

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
  appVersion: any = {version: 'local', branch: 'dev'};

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    public cdRef: ChangeDetectorRef,
    public configService: ConfigService,
    public httpClient: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.config = this.configService.config;

    // load version
    this.httpClient.get('./assets/version.json').subscribe(data => {
      if (data && data['version']) {
        this.appVersion = data;
      }
    });
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
