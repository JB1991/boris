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

  pages = [
    {name: 'Bodenrichtwerte', link: '/bodenrichtwerte'},
    {name: 'Bodenwert-Kalkulator', link: '/bodenwertkalkulator'},
    {name: 'Immobilien', link: '/immobilienpreisindex'},
    {name: 'Formulare', link: '/formulare'},
    // { name: 'Demo', link: '/demo' }
  ];

  isCollapsed = true;

  show = false;

  name: string;
  appNameSubscription: Subscription;

  /**
   * Konstruktor
   * @param store
   */
  constructor(
    private appNameService: AppNameService,
    private cdRef: ChangeDetectorRef
  ) {
    this.appNameService.getName().subscribe(name => this.name = name);
  }

  ngOnInit(): void {
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.appNameSubscription.unsubscribe();
  }

  toggleCollapse() {
    this.show = !this.show;
  }
}
